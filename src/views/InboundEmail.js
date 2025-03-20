
import React, { useState } from 'react'
import {
  Container,
  Row,
  Col
} from 'react-bootstrap'

import notion from '../utils/notion'
import NotionShipments from '../components/NotionShipments'
import CopyButton from '../components/CopyButton'
import imgSrcUrlToBase64 from '../utils/imgSrcUrlToBase64'

function InboundEmail () {
  const [shipments, setShipments] = useState([])
  const [subject, setSubject] = useState()

  async function handleSelectShipment (shipments) {
    const shipmentsText = []
    const sDates = []
    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const date = shipment.properties.date.date.start
      if (!sDates.includes(date)) sDates.push(date)
      const [product, cartonTemplate] = await notion.relationsGet(shipment, ['product', 'cartonTemplate'])
      const ct = cartonTemplate ? cartonTemplate[0] ? cartonTemplate[0] : null : null

      product.forEach(p => {
        shipmentsText.push({
          id: shipment.properties.id.title[0].plainText,
          method: shipment.properties.method.select?.name,
          numCases: shipment.properties.numCartons.number,
          totalUnitQty: Math.abs(shipment.properties.shipmentUnits.formula.number),
          trackingNumbers: shipment.properties.trackingNumberS.richText[0]?.plainText,
          productImage: p.properties.image.files[0]?.file.url,
          productSku: p.properties.sku.richText[0].plainText,
          caseQty: ct?.properties.unitQty.number,
          caseGrossWeight: ct?.properties.grossWeightLb.formula.number
        })
      })
    }

    shipmentsText
      .sort((a, b) => { return a.id < b.id ? -1 : 1 })
      .forEach((el, i) => { el.shipmentNumber = i })
    setShipments(shipmentsText)
    setSubject(`INBOUND: ${sDates.map(d => `PO-${d}`).join(', ')}`)
  }

  return (
    <Container>
      <Row>
        <Col className='pt-5'>
          <NotionShipments handleSelectShipment={handleSelectShipment} />

          <h3>Subject</h3>
          <div className='mb-4 card'>
            <div className='card-body d-flex justify-content-between'>

              {subject && (
                <>
                  <span>{subject}</span>
                  <CopyButton text={subject} />
                </>
              )}
            </div>
          </div>

          <h3>Body</h3>
          <div className='card'>
            <div className='card-body'>
              {shipments.map((s, i) => {
                return (
                  <div key={i}>
                    <strong><u>SHIPMENT #{s.shipmentNumber + 1}</u></strong><br />
                    {s.productImage && (
                      <span>
                        Reference Image:<br />
                        <img
                          alt={`${s.productSku}`}
                          src={s.productImage}
                          onLoad={e => imgSrcUrlToBase64(e.target)}
                          crossOrigin='anonymous'
                        />
                        <br />
                      </span>
                    )}
                    SKU: {s.productSku}<br />
                    Case Quantity: {s.caseQty || 'Unknown'}<br />
                    Case Gross Weight: {s.caseGrossWeight || 'Unknown'}<br />
                    Total Number of Cases: {s.numCases || 'Unknown'}<br />
                    Total Unit Quantity: {s.totalUnitQty}<br />
                    Shipping Method: {s.method}<br />
                    Tracking Number(s): {s.trackingNumbers || 'Unknown'}<br />
                    <br /><br />
                  </div>
                )
              })}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default InboundEmail
