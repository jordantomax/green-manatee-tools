import { useState } from 'react'
import { Container, Alert, Title, Paper, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

import api from '../utils/api'
import NotionShipments from '../components/NotionShipments'

function BuildManifest () {
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ warningMessage, setWarningMessage ] = useState(null)

  async function handleSelectShipment (shipments) {
    const shipmentsMassaged = []

    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [run, product, cartonTemplate] = await Promise.all(
        ['run', 'product', 'cartonTemplate'].map(async (prop) => {
          const id = shipment.properties[prop]?.relation[0]?.id
          if (!id) return null
          return await api.notionGetPage(id)
        })
      )

      if (!cartonTemplate) return setErrorMessage("Shipment has no carton template. Carton templates are required to generate manifest weight and dimensions")
      if (!run) setWarningMessage("You pulled a shipment without a production run. If this was intentional, disregard this message.")

      const exp = run?.properties?.exp?.date?.start
      // Massage to form MM/DD/YYYY
      const massagedExp = exp ? `${exp.slice(5, 7)}/${exp.slice(8, 10)}/${exp.slice(0, 4)}` : null

      shipmentsMassaged.push({
        totalUnits: shipment.properties.units.formula.number,
        numCartons: shipment.properties.numCartons.number,
        sku: product.properties.sku.title[0].plainText,
        cartonWeight: cartonTemplate.properties.grossWeightLb.formula.number,
        cartonLength: cartonTemplate.properties.lengthIn.formula.number,
        cartonWidth: cartonTemplate.properties.widthIn.formula.number,
        cartonHeight: cartonTemplate.properties.heightIn.formula.number,
        cartonUnitQty: cartonTemplate.properties.unitQty.number,
        ...massagedExp ? { expiration: massagedExp } : {}
      })
    }

    api.createManifest(shipmentsMassaged)
  }

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="lg">
        {errorMessage && (
          <Alert icon={<IconAlertCircle />} title="Error" color="red" mb="md">
            {errorMessage}
          </Alert>
        )}

        {warningMessage && (
          <Alert icon={<IconAlertCircle />} title="Warning" color="yellow" mb="md">
            {warningMessage}
          </Alert>
        )}
        <Title order={2} mb="md">Build Amazon manifest</Title>
        <NotionShipments handleSelectShipment={handleSelectShipment} inline />
      </Paper>
    </Container>
  )
}

export default BuildManifest
