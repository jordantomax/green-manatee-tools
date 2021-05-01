import React from 'react'
import capitalize from 'lodash/capitalize'

import Input from './Input'

function Address ({ address, name, handleChange }) {
  return (
    <>
      <h2>{capitalize(name)}</h2>

      {Object.entries(address).map(([key, value], i) => {
        console.log(value)
        return (
          <Input
            key={i}
            onChange={handleChange}
            name={`${name}.${key}`}
            label={capitalize(key)}
            defaultValue={value}
          />
        )
      })}
    </>
  )
}

export default Address
