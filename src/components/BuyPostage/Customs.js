import React from 'react'

import Input from '../Input'

function Customs ({ data, handleChange }) {
  return (
    <div className='mb-4'>
      <h2>Customs Declaration</h2>
      <p>Required for international shipments</p>

      <Input
        name='customsDeclaration.certifySigner'
        label='Certify Signer'
        onChange={handleChange}
        defaultValue={data.certifySigner}
      />

      <Input
        name='customsDeclaration.description'
        label='Description'
        onChange={handleChange}
        defaultValue={data.description}
      />
    </div>
  )
}

export default Customs
