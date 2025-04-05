import React from 'react'
import { Form } from 'react-bootstrap'

function TextInput ({
  id,
  label,
  error,
  ...inputProps
}) {
  if (!inputProps) inputProps = {}

  return (
    <Form.Group>
      {label && (
        <Form.Label htmlFor={id}>
          {label}
        </Form.Label>
      )}

      <Form.Control
        name={id}
        id={id}
        type='text'
        size='sm'
        isInvalid={!!error}
        {...inputProps}
      />

      <Form.Control.Feedback type='invalid'>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default TextInput
