import React from 'react'
import { Stack, Checkbox, Paper, Title } from '@mantine/core'

function Hazmat ({ hazmat, handleChange }) {
  function handleCheck (e) {
    handleChange({
      target: {
        name: 'contains', 
        value: e.currentTarget.checked
      }
    })
  }

  return (
    <Stack gap="md">
      <Title order={3} style={{ margin: 0 }}>Hazmat</Title>
      <Checkbox
        label="This shipment contains hazardous materials"
        checked={hazmat}
        onChange={handleCheck}
        size="md"
      />
    </Stack>
  )
}

export default Hazmat
