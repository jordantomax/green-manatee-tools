import React from 'react'
import { Card } from 'react-bootstrap'

import { rateParcelMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function RateParcels ({ parcels }) {
  return (
    <>
      <h3>Parcels in this Shipment </h3>

      {parcels.length === 0 && (
        <Card>
          <Card.Body>
            No parcels in this shipment
          </Card.Body>
        </Card>
      )}

      {parcels.map((parcel, i) => {
        return (
          <Card
            key={parcel.objectId}
            className='mb-4'
          >
            <Card.Body>
              <DataList
                obj={parcel}
                mask={rateParcelMask}
              />
            </Card.Body>
          </Card>
        )
      })}
    </>
  )
}

export default RateParcels
