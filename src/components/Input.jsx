import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

function TextInput ({
  id,
  label,
  error,
  ...inputProps
}) {
  if (!inputProps) inputProps = {}

  return (
    <Form.Group as={Row} className='mb-0'>
      {label && (
        <Form.Label
          column
          sm='3'
          htmlFor={id}
        >
          {label}
        </Form.Label>
      )}

      <Col sm='9'>
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
      </Col>
    </Form.Group>
  )
}

export default TextInput
