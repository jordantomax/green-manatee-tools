import React, { useState } from 'react'
import {
  Container,
  Button,
  Badge,
  Title,
  Stack,
  Group
} from '@mantine/core'

import { setLocalData, getLocalData } from '@/utils/storage'
import api from '@/api'
import InventoryRestockRecs from '@/components/InventoryRestockRecs'

function Inventory () {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(getLocalData('inventoryRecs') || [])
  const [datetime, setDatetime] = useState(new Date(getLocalData('inventoryRecsDatetime')))

  async function getRecommendations () {
    setIsLoading(true)
    try {
      const data = await api.getRecs()
      setLocalData('inventoryRecs', data)
      setData(data)

      const date = new Date()
      setLocalData('inventoryRecsDatetime', date)
      setDatetime(date)
    } finally {
      setIsLoading(false)
    }
  }

  function handleRemove (productToRemove) {
    const updatedData = data.filter(product => product !== productToRemove)
    setLocalData('inventoryRecs', updatedData)
    setData(updatedData)
  }
  
  const fbaRecs = data?.filter(product => product.restock.fba > 0)
  const warehouseRecs = data?.filter(product => product.restock.warehouse > 0)
  const noneRecs = data?.filter(product => !Object.values(product.restock).some(value => value > 0))

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Restock Recommendations</Title>

        <Group>
          <Button
            onClick={getRecommendations}
            loading={isLoading}
          >
            Get Recommendations
          </Button>
        </Group>

        {data ? (
          <Stack spacing="xl">
            <Badge size="sm" color="gray" variant="light">
              Synced on {datetime.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "long" })} at {datetime.toLocaleString("en-US", { timeZone: "America/Los_Angeles", timeStyle: "long" })}
            </Badge>

            <Title order={3}>FBA — restock {fbaRecs.length} SKUs</Title>
            <InventoryRestockRecs products={fbaRecs} onRemove={handleRemove} />

            <Title order={3}>Warehouse — restock {warehouseRecs.length} SKUs</Title>
            <InventoryRestockRecs products={warehouseRecs} onRemove={handleRemove} />

            <Title order={3}>No restock needed — {noneRecs.length} SKUs</Title>
            <InventoryRestockRecs products={noneRecs} onRemove={handleRemove} />
          </Stack>
        ) : null}
      </Stack>
    </Container>
  )
}

export default Inventory
