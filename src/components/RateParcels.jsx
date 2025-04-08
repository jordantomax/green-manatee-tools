import React from 'react'
import { Paper, Text } from '@mantine/core'

import { rateParcelMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function RateParcels ({ parcels }) {
  return (
    <>
      <h3>Parcels in this Shipment </h3>

      {parcels.length === 0 && (
        <Paper>
          <Text>
            No parcels in this shipment
          </Text>
        </Paper>
      )}

      {parcels.map((parcel, i) => {
        return (
          <Paper key={parcel.objectId} >
            <Text>
              <DataList
                obj={parcel}
                mask={rateParcelMask}
              />
            </Text>
          </Paper>
        )
      })}
    </>
  )
}

export default RateParcels
