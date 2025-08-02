import React from 'react'
import { Title, Paper, Text, Stack } from '@mantine/core'

import DataList from '@/components/DataList'

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
              data={parcel}
              keys={['length', 'width', 'height', 'weight', 'massUnit', 'distanceUnit']}
            />
          </Paper>
        )
      })}
    </Stack>
  )
}

export default RateParcels
