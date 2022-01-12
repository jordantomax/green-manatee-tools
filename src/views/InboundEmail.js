
import React, { useState } from 'react'
import {
  Container
} from 'react-bootstrap'

import notion from '../utils/notion'
import NotionShipments from '../components/NotionShipments'

function InboundEmail () {
  const [shipments, setShipments] = useState([])

  async function handleSelectShipment (shipments) {
    const shipmentsText = []
    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [product, cartonTemplate] = await Promise.all(
        ['product', 'cartonTemplate'].map(async (prop) => {
          const id = shipment.properties[prop]?.relation[0]?.id
          return await notion.pageRetrieve(id)
        })
      )

      shipmentsText.push({
        id: shipment.properties.id.title[0].plainText,
        numCases: shipment.properties.numCartons.number,
        totalUnitQty: shipment.properties.totalUnits.formula.number,
        trackingNumbers: shipment.properties.trackingNumberS.richText[0].plainText,
        productImage: product.properties.image.files[0]?.file.url,
        productSku: product.properties.sku.richText[0].plainText,
        caseQty: cartonTemplate.properties.unitQty.number,
        caseGrossWeight: cartonTemplate.properties.grossWeightLb.formula.number
      })
    }

    shipmentsText
      .sort((a, b) => { return a.id < b.id ? -1 : 1 })
      .forEach((el, i) => { el.shipmentNumber = i })
    setShipments(shipmentsText)
  }

  return (
    <Container>
      <NotionShipments handleSelectShipment={handleSelectShipment} />

      <h3>Subject</h3>
      <div className='mb-4 card'>
        <div className='card-body'>
          <span>Inbound - </span>
          {shipments.map((s, i) => {
            return (
              <span key={i}>{s.productSku} ({s.totalUnitQty}){i !== shipments.length - 1 ? ', ' : ''}</span>
            )
          })}
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
                    <img width='175' alt={`${s.productSku}`} src={s.productImage} /><br />
                  </span>
                )}
                SKU: {s.productSku}<br />
                Case Quantity: {s.caseQty}<br />
                Case Gross Weight: {s.caseGrossWeight}<br />
                Total number of cases: {s.numCases}<br />
                Total quantity: {s.totalUnitQty}<br />
                Tracking Number(s): {s.trackingNumbers}<br />
                <br />
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}

export default InboundEmail
