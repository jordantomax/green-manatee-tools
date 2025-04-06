import React from 'react'
import { Stack, Title } from '@mantine/core'

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
      <Title order={3} style={{ margin: 0 }}>Shipment Parcels</Title>
      <ItemGroup
        name='parcel'
        items={parcels}
        factory={parcelFactory}
        handleChange={handleParcelChange}
        columns={4}
      />
    </Stack>
  )
}

export default Parcels
