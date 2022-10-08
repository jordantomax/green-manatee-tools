
import React, { useState } from 'react'
import {
  Container
} from 'react-bootstrap'

import notion from '../utils/notion'
import NotionShipments from '../components/NotionShipments'
import imgSrcUrlToBase64 from '../utils/imgSrcUrlToBase64'

function InboundEmail () {
  const [shipments, setShipments] = useState([])

  async function handleSelectShipment (shipments) {
    const shipmentsText = []
    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [product, cartonTemplate] = await Promise.all(
        ['product', 'cartonTemplate'].map(async (prop) => {
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
      const ct = cartonTemplate ? cartonTemplate[0] ? cartonTemplate[0] : null : null
      product.forEach(p => {
        shipmentsText.push({
          id: shipment.properties.id.title[0].plainText,
          method: shipment.properties.method.select?.name,
          numCases: shipment.properties.numCartons.number,
          totalUnitQty: shipment.properties.totalUnits.formula.number,
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
    </Container>
  )
}

export default InboundEmail
