import { useState } from 'react'
import { Container, Alert, Title } from '@mantine/core'

import notion from '../utils/notion'
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
          return await notion.pageGet(id)
        })
      )

      if (!cartonTemplate) setErrorMessage("You pulled a shipment without a carton template. Carton templates are required for all records in order to generate the manifest weight and dimensions. Please add the carton template and retry.")
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
      {errorMessage && (
        <Alert color="red" mb="md">
          {errorMessage}
        </Alert>
      )}
      {warningMessage && (
        <Alert color="yellow" mb="md">
          {warningMessage}
        </Alert>
      )}
      <Title order={3} mb="md">Build Amazon manifest</Title>
      <NotionShipments handleSelectShipment={handleSelectShipment} inline />
    </Container>
  )
}

export default BuildManifest
