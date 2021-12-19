import React from 'react'

import { customsItemFactory } from '../../factories'
import Input from '../Input'
import ItemGroup from '../ItemGroup'

function Customs ({ data, handleChange }) {
  function handleItemChange (value) {
    handleChange({
      target: { name: 'customsDeclaration.items', value }
    })
  }

  return (
    <div className='mb-4'>
      <h2>Customs Declaration</h2>
      <p>Required for international shipments</p>

      <Input
        id='customsDeclaration.certifySigner'
        label='Certify Signer'
        onChange={handleChange}
        defaultValue={data.certifySigner}
      />

      <Input
        id='customsDeclaration.description'
        label='Description'
        onChange={handleChange}
        defaultValue={data.description}
      />

      <ItemGroup
        name='item'
        items={data.items}
        factory={customsItemFactory}
        handleChange={handleItemChange}
      />
    </div>
  )
}

export default Customs
