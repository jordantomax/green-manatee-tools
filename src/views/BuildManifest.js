import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Alert
} from 'react-bootstrap'

import { SHIPPING_MANIFEST_BUILDER_API_URL } from '../constants'
import notion from '../utils/notion'
import NotionShipments from '../components/NotionShipments'

function BuildManifest () {
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ warningMessage, setWarningMessage ] = useState(null)

  async function handleSelectShipment (shipments) {
    const shipmentsMassaged = []

    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [run, cartonTemplate] = await Promise.all(
        ['runOut', 'cartonTemplate'].map(async (prop) => {
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
        quantity: shipment.properties.totalUnits.formula.number,
        numCartons: shipment.properties.numCartons.number,
        sku: shipment.properties.sku.rollup.array[0].richText[0].text.content,
        expiration: massagedExp,
        cartonWeight: cartonTemplate.properties.grossWeightLb.formula.number,
        cartonLength: cartonTemplate.properties.lengthIn.formula.number,
        cartonWidth: cartonTemplate.properties.widthIn.formula.number,
        cartonHeight: cartonTemplate.properties.heightIn.formula.number,
        cartonQty: cartonTemplate.properties.unitQty.number
      })
    }

    getManifest(shipmentsMassaged)
  }

  async function getManifest (shipments) {
    const res = await fetch(SHIPPING_MANIFEST_BUILDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shipments })
    })
    const base64Txt = await res.text()
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${base64Txt}`
    link.download = 'manifest.txt'
    link.click()
  }


  return (
    <Container>
      <Row>
        <Col className='pt-5'>
          {errorMessage && (
            <Alert variant='danger'>
              {errorMessage}
            </Alert>
          )}
          {warningMessage && (
            <Alert variant='warning'>
              {warningMessage}
            </Alert>
          )}
          <h3>Build Amazon manifest</h3>
          <NotionShipments handleSelectShipment={handleSelectShipment} />
        </Col>
      </Row>
    </Container>
  )
}

export default BuildManifest
