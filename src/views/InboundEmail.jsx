
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
