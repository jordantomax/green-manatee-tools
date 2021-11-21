import React from 'react'
import capitalize from 'lodash/capitalize'

import camelToSentenceCase from '../utils/camelToSentenceCase'
import Input from './Input'

function Address ({ address, name, handleChange }) {
  return (
    <div className='pb-4'>
      <h2>{camelToSentenceCase(name)}</h2>

      {Object.entries(address)
        .filter(([key]) => key !== 'id')
        .map(([key, value], i) => {
          return (
            <Input
              key={`${address.id}${key}`}
              id={`${name}.${key}`}
              label={capitalize(key)}
              onChange={handleChange}
              defaultValue={value}
            />
          )
        })}
    </div>
  )
}

export default Address
