import React from 'react'
import { Stack, Title, Paper } from '@mantine/core'

import { parcelFactory } from '../factories'
import ItemGroup from './ItemGroup'

function Parcels ({
  parcels,
  handleChange
}) {
  function handleParcelChange (value) {
    handleChange({
      target: { name: 'parcels', value }
    })
  }

  return (
    <Stack gap="md">
      <Title order={2} style={{ margin: 0 }}>Shipment Parcels</Title>
      <ItemGroup
        name='parcel'
        items={parcels}
        factory={parcelFactory}
        handleChange={handleParcelChange}
        columns={3}
      />
    </Stack>
  )
}

export default Parcels
