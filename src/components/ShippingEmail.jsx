import { useState, useEffect } from 'react'
import { Button, Modal, Text, Stack, Group, CopyButton, Box, Image, SegmentedControl, Paper, Title } from '@mantine/core'
import { IconCopy } from '@tabler/icons-react'
import { startCase } from 'lodash'

import api from '@/utils/api'
import { useError } from '@/contexts/Error'

function ShippingEmail ({ shipments }) {
    const [isWritingEmail, setIsWritingEmail] = useState(false)
    const [subject, setSubject] = useState(null)
    const [processedShipments, setProcessedShipments] = useState([])
    const [shipmentDates, setShipmentDates] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [inboundOutbound, setInboundOutbound] = useState('outbound')
    const [isCopying, setIsCopying] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const { showError } = useError()

    useEffect(() => {
        setSubject(`${inboundOutbound.toUpperCase()}: ${shipmentDates.map(d => `PO-${d}`).join(', ')}`)
    }, [inboundOutbound, shipmentDates])

    useEffect(() => {
        if (inboundOutbound === 'outbound') {
            if (processedShipments.find(s => s.inStock < 0)) {
                showError(new Error("Not enough inventory for some shipments"))
            }
        }
    }, [inboundOutbound, processedShipments])

    const imageToBase64 = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            showError(new Error("Error converting image to base64: " + error))
            return null
        }
    }

    const copyAsHtml = async () => {
        setIsCopying(true)
        try {
            const htmlContent = processedShipments.map(s => `
                <div style="margin-bottom: 20px;">
                    <h3>${s.id ?? ''}</h3>
                    ${s.base64Image ? `<img src="${s.base64Image}" alt="${s.productSku ?? ''}" style="max-width: 200px; margin: 10px 0;" />` : ''}
                    ${s.productSku ? `<p><strong>SKU:</strong> ${s.productSku}</p>` : ''}
                    ${s.productGtin12 ? `<p><strong>Barcode:</strong> ${s.productGtin12}</p>` : ''}
                    ${s.destinationName ? `<p><strong>Destination:</strong> ${s.destinationName}</p>` : ''}
                    ${s.caseUnitQty && s.numCases > 0 ? `<p><strong>Case Quantity:</strong> ${s.caseUnitQty}</p>` : ''}
                    ${`<p><strong>Total cases:</strong> ${s.numCases}</p>`}
                    ${s.totalUnitQty ? `<p><strong>Total unit quantity:</strong> ${s.totalUnitQty}</p>` : ''}
                    ${s.caseGrossWeightLb && s.numCases > 0 ? `<p><strong>Case gross weight:</strong> ${s.caseGrossWeightLb} lbs</p>` : ''}
                    ${s.shippingMethod ? `<p><strong>Shipping method:</strong> ${s.shippingMethod}</p>` : ''}
                    ${s.trackingNumbers ? `<p><strong>Tracking numbers:</strong> ${s.trackingNumbers}</p>` : ''}
                </div>
            `).join('\n')

            const blob = new Blob([htmlContent], { type: 'text/html' })
            const data = [new ClipboardItem({ 'text/html': blob })]
            await navigator.clipboard.write(data)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 1000)
        } catch (error) {
            showError(new Error("Error copying to clipboard: " + error))
        } finally {
            setIsCopying(false)
        }
    }

    async function writeEmail (shipments) {
        const sData = []
        const sDates = []
        let hasProcessedAnyShipment = false

        for (let i = 0; i < shipments.length; i++) {
            const shipment = shipments[i]
            const date = shipment.properties.date.start
            if (!sDates.includes(date)) sDates.push(date)

            try {
                const resources = await Promise.all(
                    ['product', 'run', 'destination', 'cartonTemplate'].map(async (prop) => {
                        const id = shipment.properties[prop]?.id
                        if (!id) {
                            return null
                        }
                        return await api.getResource(prop, id)
                    })
                )
                const [product, run, destination, cartonTemplate] = resources

                if (product?.properties) {
                    hasProcessedAnyShipment = true
                    const productImage = product.properties.image?.files?.[0]?.file?.url
                    let base64Image = null
                    if (productImage) {
                        base64Image = await imageToBase64(productImage)
                    }

                    sData.push({
                        id: shipment.properties.id.value,
                        numCases: shipment.properties.numCartons.value,
                        totalUnitQty: shipment.properties.units.value,
                        caseUnitQty: cartonTemplate?.properties?.unitQty?.value,
                        caseGrossWeightLb: cartonTemplate?.properties?.grossWeightLb?.value,
                        shippingMethod: shipment.properties.method?.select?.value,
                        trackingNumbers: shipment.properties.trackingNumbers?.value,
                        base64Image,
                        productSku: product.properties.sku?.value,
                        productGtin12: product.properties.gtin12?.value,
                        destinationName: destination?.properties?.name?.value,
                        inStock: run?.properties?.inStock?.value || -1
                    })
                }
            } catch (error) {
                showError(new Error("Error processing shipment: " + error))
            }
        }
        
        if (sData.length > 0) {
            setProcessedShipments(sData)
            setShipmentDates(sDates)
        } else if (hasProcessedAnyShipment) {
            showError(new Error("No valid shipments found to process"))
        }
    }

    return (
        <>
        <Button
            disabled={shipments.length === 0}
            loading={isWritingEmail}
            onClick={async () => {
                setIsWritingEmail(true)

                try {
                    await writeEmail(shipments)
                    setModalOpened(true)
                } catch (error) {
                    showError(new Error("Error writing email: " + error))
                } finally {
                    setIsWritingEmail(false)
                }
            }}
        >
            Write Email
        </Button>

        <Modal 
            opened={modalOpened} 
            onClose={() => setModalOpened(false)}
            title="Email Content"
            size="lg"
        >
            <Stack gap="lg">
                <SegmentedControl
                    value={inboundOutbound}
                    onChange={(value) => {
                    setInboundOutbound(value)
                    }}
                    data={[
                        { label: 'Outbound', value: 'outbound' },
                        { label: 'Inbound', value: 'inbound' }
                    ]}
                />

                <Box>
                    <Group justify="space-between" align="center" mb="xs"> 
                        <Title order={3}>Subject</Title>
                        <CopyButton value={subject}>
                            {({ copied, copy }) => (
                                <Button 
                                    variant="light" 
                                    size="xs" 
                                    onClick={copy} 
                                    leftSection={<IconCopy size={16} />}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            )}
                        </CopyButton>
                    </Group>
                    <Paper>
                        <Group justify="space-between">
                            {subject && (<Text>{subject}</Text>)}
                        </Group>
                    </Paper>
                </Box>

                <Box>
                    <Group justify="space-between" align="center" mb="xs">
                        <Title order={3}>Body</Title>
                        <Button 
                            variant="light" 
                            size="xs" 
                            onClick={copyAsHtml}
                            loading={isCopying}
                            leftSection={<IconCopy size={16} />}
                        >
                            {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </Group>
                    <Paper>
                        <Stack gap="xs">
                            {processedShipments.map((shipment, i) => (
                                <Box key={i} mb="md">
                                    <Stack>
                                        <Title order={4}>{shipment.id}</Title>
                                        <Box>
                                            {shipment.base64Image && (
                                                <Box mb="xs">
                                                    <Text size="sm" fw={500} mb="xs">Reference Image:</Text>
                                                    <Image 
                                                        src={shipment.base64Image} 
                                                        alt={shipment.productSku}
                                                        w={200}
                                                        h="auto"
                                                        fit="contain"
                                                    />
                                                </Box>
                                            )}
                                            {[
                                             'productSku',
                                             'productGtin12',
                                             'destinationName',
                                             'caseUnitQty',
                                             'numCases',
                                             'totalUnitQty',
                                             'caseGrossWeightLb',
                                             'shippingMethod',
                                             'trackingNumbers'
                                            ].map(prop => {
                                                if (
                                                  (prop !== 'numCases' && !shipment[prop]) ||
                                                  (prop === 'caseUnitQty' && shipment.numCases === 0) ||
                                                  (prop === 'caseGrossWeightLb' && shipment.numCases === 0)
                                                ) return null

                                                return (
                                                    <Text key={prop} size="sm"><Text span fw={500}>{startCase(prop)}:</Text> {shipment[prop]}</Text>
                                                )
                                              })
                                            }
                                        </Box>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Box>
            </Stack>
        </Modal>
        </>
    )
}

export default ShippingEmail