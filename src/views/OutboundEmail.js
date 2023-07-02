import React, { useState } from 'react'
import {
  Container,
  Row,
  Col
} from 'react-bootstrap'

import HeaderNav from '../components/Nav'
import notion from '../utils/notion'
import NotionShipments from '../components/NotionShipments'
import imgSrcUrlToBase64 from '../utils/imgSrcUrlToBase64'

function OutboundEmail () {
  const [shipments, setShipments] = useState([])

  async function handleSelectShipment (shipments) {
    const shipmentsText = []
    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [product, destination, cartonTemplate] = await Promise.all(
        ['product', 'destination', 'cartonTemplate'].map(async (prop) => {
          if (!shipment.properties[prop] || shipment.properties[prop].relation.length <= 0) return null

          return await Promise.all(
            // accomodate multiple products per shipment
            shipment.properties[prop].relation.map(async (r) => {
              if (!r.id) return null
              return await notion.pageRetrieve(r.id)
            })
          )
        })
      )

      const d = destination ? destination[0] ? destination[0] : null : null
      const ct = cartonTemplate ? cartonTemplate[0] ? cartonTemplate[0] : null : null
      product.forEach(p => {
        shipmentsText.push({
          id: shipment.properties.id.title[0].plainText,
          number: shipment.properties.number.number,
          numCases: shipment.properties.numCartons.number,
          totalUnitQty: shipment.properties.totalUnits.formula.number,
          productImage: p.properties.image.files[0]?.file.url,
          productSku: p.properties.sku.richText[0].plainText,
          destinationName: d.properties.name.title[0].plainText,
          caseQty: ct?.properties.unitQty.number
        })
      })
    }

    shipmentsText
      .sort((a, b) => { return a.number < b.number ? -1 : 1 })
    setShipments(shipmentsText)
  }

  return (
    <>
      <HeaderNav />

      <Container>
        <Row>
          <Col className='pt-5'>
            <NotionShipments handleSelectShipment={handleSelectShipment} />

            <h3>Subject</h3>
            <div className='mb-4 card'>
              <div className='card-body'>
                <span>OUTBOUND - </span>
                {shipments.map((s, i) => {
                  return (
                    <span key={i}>{s.productSku} ({s.totalUnitQty}){i !== shipments.length - 1 ? ', ' : ''}</span>
                  )
                })}
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
    </>
  )
}

export default OutboundEmail
