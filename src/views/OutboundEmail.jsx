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

function OutboundEmail () {
  const [shipments, setShipments] = useState([])
  const [subject, setSubject] = useState()

  async function handleSelectShipment (shipments) {
    const sData = []
    const sDates = []
    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const date = shipment.properties.date.date.start
      if (!sDates.includes(date)) sDates.push(date)
      const [product, destination, cartonTemplate] = await notion.relationsGet(shipment, ['product', 'destination', 'cartonTemplate'])
      const d = destination ? destination[0] ? destination[0] : null : null
      const ct = cartonTemplate ? cartonTemplate[0] ? cartonTemplate[0] : null : null
      product.forEach(p => {
        sData.push({
          id: shipment.properties.id.title[0].plainText,
          number: shipment.properties.number.number,
          numCases: shipment.properties.numCartons.number,
          totalUnitQty: shipment.properties.units.formula.number,
          productImage: p.properties.image.files[0]?.file.url,
          productSku: p.properties.sku.title[0].plainText,
          destinationName: d?.properties.name.title[0].plainText,
          caseQty: ct?.properties.unitQty.number
        })
      })
    }
    sData.sort((a, b) => a.number < b.number ? -1 : 1 )
    setShipments(sData)
    setSubject(`OUTBOUND: ${sDates.map(d => `PO-${d}`).join(', ')}`)
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

          <h3>Shipment summary</h3>
          <div className='card'>
            <div className='card-body'>
              {shipments.map((s, i) => {
                return (
                  <div key={i}>
                    <strong><u>SHIPMENT #{s.number}</u></strong><br />
                    Reference Image:<br />
                    <img
                      alt={`${s.productSku}`}
                      src={s.productImage}
                      onLoad={e => imgSrcUrlToBase64(e.target)}
                      crossOrigin='anonymous'
                    />
                    <br />
                    SKU: {s.productSku}<br />
                    Destination: {s.destinationName}<br />
                    Case Quantity: {s.caseQty}<br />
                    Total number of cases: {s.numCases}<br />
                    Total quantity: {s.totalUnitQty}<br />
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

export default OutboundEmail
