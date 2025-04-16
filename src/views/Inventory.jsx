import React, { useState } from 'react'
import {
  Container,
  Button,
  Badge,
  Title,
  Stack,
  Group
} from '@mantine/core'

import { setLocalData, getLocalData } from '../utils/storage'
import api from '../utils/api'
import InventoryRestockRecs from '../components/InventoryRestockRecs'

function Inventory () {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(getLocalData('inventoryRecs'))
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

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Inventory Manager</Title>

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

            <Title order={3}>Restock {data.restockNeeded.length} SKUs</Title>
            <InventoryRestockRecs products={data.restockNeeded} />

            <Title order={3}>No Restock {data.noRestockNeeded.length} SKUs</Title>
            <InventoryRestockRecs products={data.noRestockNeeded} />
          </Stack>
        ) : null}
      </Stack>
    </Container>
  )
}

export default Inventory
