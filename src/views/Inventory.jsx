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

  const fbaRecs = data?.filter(product => product.restock.fba?.needsRestock) || []
  const awdRecs = data?.filter(product => product.restock.awd?.needsRestock) || []
  const warehouseRecs = data?.filter(product => product.restock.warehouse?.needsRestock) || []
  const noneRecs = data?.filter(product => !Object.values(product.restock).some(value => value?.needsRestock)) || []

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

        {data.length > 0 ? (
          <Stack spacing="xl">
            <Badge size="sm" color="gray" variant="light">
              Synced on {datetime.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "long" })} at {datetime.toLocaleString("en-US", { timeZone: "America/Los_Angeles", timeStyle: "long" })}
            </Badge>

            <InventoryRestockRecs 
              recommendations={fbaRecs} 
              location="fba" 
            />
            <InventoryRestockRecs 
              recommendations={awdRecs} 
              location="awd" 
            />
            <InventoryRestockRecs 
              recommendations={warehouseRecs} 
              location="warehouse" 
            />
            <InventoryRestockRecs recommendations={noneRecs} />
          </Stack>
        ) : null}
      </Stack>
    </Container>
  )
}

export default Inventory
