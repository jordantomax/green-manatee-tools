import React from 'react'
import { Stack, TextInput, Group, Title, Text, Paper } from '@mantine/core'

import { customsItemFactory } from '@/factories'
import ItemGroup from '@/components/ItemGroup'

function Customs ({ data, handleChange }) {
  function handleItemChange (value) {
    handleChange({
      target: { 
        name: 'customsDeclaration.items', 
        value: value 
      }
    })
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3} style={{ margin: 0 }}>Customs Declaration</Title>
        <Text c="dimmed">Required for international shipments</Text>
      </Group>

      <TextInput
        label="Certify Signer"
        placeholder="Certify signer name"
        defaultValue={data.certifySigner}
        onChange={handleChange}
        name="customsDeclaration.certifySigner"
      />

      <TextInput
        label="Description"
        placeholder="Description of items"
        defaultValue={data.description}
        onChange={handleChange}
        name="customsDeclaration.description"
      />

      <ItemGroup
        name='item'
        items={data.items || []}
        factory={customsItemFactory}
        handleChange={handleItemChange}
      />
    </Stack>
  )
}

export default Customs
