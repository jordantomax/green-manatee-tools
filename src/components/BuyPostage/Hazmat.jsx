import React from 'react'
import { Form } from 'react-bootstrap'

function Hazmat ({ hazmat, handleChange }) {
  function handleCheck (e) {
    handleChange({
      target: {
        name: 'extra.dangerousGoods.contains', value: e.target.checked
      }
    })
  }

  return (
    <>
      <Form.Check
        name='hazmat'
        type='checkbox'
        checked={hazmat}
        onChange={handleCheck}
        label='Hazmat'
      />
      <br></br>
      <br></br>
    </>
  )
}

export default Hazmat
