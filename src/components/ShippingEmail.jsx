import { useState, useEffect } from 'react'
import { Button, Modal, Text, Stack, Group, CopyButton, Box, Image, SegmentedControl, Paper, Title } from '@mantine/core'
import { IconCopy } from '@tabler/icons-react'
import api from '../utils/api'

function ShippingEmail ({ shipments }) {
    const [isWritingEmail, setIsWritingEmail] = useState(false)
    const [subject, setSubject] = useState(null)
    const [processedShipments, setProcessedShipments] = useState([])
    const [shipmentDates, setShipmentDates] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [emailType, setEmailType] = useState('outbound')
    const [isCopying, setIsCopying] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    
    useEffect(() => {
        setSubject(`${emailType.toUpperCase()}: ${shipmentDates.map(d => `PO-${d}`).join(', ')}`)
    }, [emailType, shipmentDates])

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
            console.error('Error converting image to base64:', error)
            return null
        }
    }

    const copyAsHtml = async () => {
        setIsCopying(true)
        try {
            const htmlContent = processedShipments.map(s => `
                <div style="margin-bottom: 20px;">
                    <h3>SHIPMENT #${s.number}</h3>
                    ${s.base64Image ? `<img src="${s.base64Image}" alt="${s.productSku}" style="max-width: 200px; margin: 10px 0;" />` : ''}
                    <p><strong>SKU:</strong> ${s.productSku}</p>
                    <p><strong>Destination:</strong> ${s.destinationName}</p>
                    <p><strong>Case Quantity:</strong> ${s.caseUnitQty}</p>
                    <p><strong>Total number of cases:</strong> ${s.numCases}</p>
                    <p><strong>Total quantity:</strong> ${s.totalUnitQty}</p>
                    <p><strong>Case gross weight:</strong> ${s.caseGrossWeightLb} lbs</p>
                    <p><strong>Shipping method:</strong> ${s.shippingMethod}</p>
                    <p><strong>Tracking numbers:</strong> ${s.trackingNumbers}</p>
                </div>
            `).join('\n')

            const blob = new Blob([htmlContent], { type: 'text/html' })
            const data = [new ClipboardItem({ 'text/html': blob })]
            await navigator.clipboard.write(data)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 1000)
        } catch (error) {
            console.error('Error copying to clipboard:', error)
            alert('Failed to copy to clipboard. Please try again.')
        } finally {
            setIsCopying(false)
        }
    }

    async function writeEmail (shipments) {
        const sData = []
        const sDates = []

        for (let i = 0; i < shipments.length; i++) {
            const shipment = shipments[i]
            const date = shipment.properties.date.date.start
            if (!sDates.includes(date)) sDates.push(date)

            const [product, destination, cartonTemplate] = await api.notionGetRelations(shipment, ['product', 'destination', 'cartonTemplate'])
            const d = destination ? destination[0] ? destination[0] : null : null
            const ct = cartonTemplate ? cartonTemplate[0] ? cartonTemplate[0] : null : null

            for (const p of product) {
                if (p && p.properties) {
                    const productImage = p.properties.image?.files?.[0]?.file?.url
                    let base64Image = null
                    if (productImage) {
                        base64Image = await imageToBase64(productImage)
                    }
                    console.log(ct)
                    sData.push({
                        id: shipment.properties.id.title[0].plainText,
                        number: shipment.properties.number.number,
                        numCases: shipment.properties.numCartons.number,
                        totalUnitQty: shipment.properties.units.formula.number,
                        caseUnitQty: ct?.properties?.unitQty?.number || 'N/A',
                        caseGrossWeightLb: ct?.properties?.grossWeightLb?.formula.number || 'N/A',
                        shippingMethod: shipment.properties.method?.select?.name || 'N/A',
                        trackingNumbers: shipment.properties.trackingNumbers?.richText?.[0]?.plainText || 'N/A',
                        base64Image,
                        productSku: p.properties.sku?.title?.[0]?.plainText || 'N/A',
                        destinationName: d?.properties?.name?.title?.[0]?.plainText || 'N/A'
                    })
                }
            }
        }
        sData.sort((a, b) => a.number < b.number ? -1 : 1 )
        setProcessedShipments(sData)
        setShipmentDates(sDates)
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
                    alert('Error writing email: ' + error.message)
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
                    value={emailType}
                    onChange={(value) => {
                        setEmailType(value)
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
                            {processedShipments.map((s, i) => (
                                <Box key={i} mb="md">
                                    <Stack>
                                        <Title order={4}>Shipment #{s.number}</Title>
                                        <Box>
                                            {s.base64Image && (
                                                <Box mb="xs">
                                                    <Text size="sm" fw={500} mb="xs">Reference Image:</Text>
                                                    <Image 
                                                        src={s.base64Image} 
                                                        alt={s.productSku}
                                                        w={200}
                                                        h="auto"
                                                        fit="contain"
                                                    />
                                                </Box>
                                            )}
                                            <Text size="sm"><Text span fw={500}>SKU:</Text> {s.productSku}</Text>
                                            <Text size="sm"><Text span fw={500}>Destination:</Text> {s.destinationName}</Text>
                                            <Text size="sm"><Text span fw={500}>Case Quantity:</Text> {s.caseUnitQty}</Text>
                                            <Text size="sm"><Text span fw={500}>Total number of cases:</Text> {s.numCases}</Text>
                                            <Text size="sm"><Text span fw={500}>Total unit quantity:</Text> {s.totalUnitQty}</Text>
                                            <Text size="sm"><Text span fw={500}>Case gross weight:</Text> {s.caseGrossWeightLb} lbs</Text>
                                            <Text size="sm"><Text span fw={500}>Shipping method:</Text> {s.shippingMethod}</Text>
                                            <Text size="sm"><Text span fw={500}>Tracking numbers:</Text> {s.trackingNumbers}</Text>
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