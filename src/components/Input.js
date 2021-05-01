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
      {label && <Form.Label htmlFor={id}>{label}</Form.Label>}

      <Form.Control
        id={id}
        type='text'
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
