import React from 'react'
import { Title, Paper, Text, Stack, Box } from '@mantine/core'

import { rateParcelMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function RateParcels ({ parcels }) {
  return (
    <Stack gap="sm">
      <Title order={3}>Shipment Parcels</Title>

      {parcels.length === 0 && (
        <Text c="dimmed">No parcels</Text>
      )}

      {parcels.map((parcel, i) => {
        return (
          <Paper key={parcel.objectId} p="sm">
            <DataList
              obj={parcel}
              mask={rateParcelMask}
            />
          </Paper>
        )
      })}
    </Stack>
  )
}

export default RateParcels
