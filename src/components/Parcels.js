import React from 'react'

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
    <ItemGroup
      name='parcel'
      items={parcels}
      factory={parcelFactory}
      handleChange={handleParcelChange}
    />
  )
}

export default Parcels
