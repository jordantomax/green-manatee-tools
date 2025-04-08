import React, { useState } from 'react'
import {
  Container,
  Button,
  Alert,
  Badge,
  Title,
  Stack,
  Group
} from '@mantine/core'

import { setLocalData, getLocalData } from '../utils/storage'
import api from '../utils/api'
import InventoryRestockRecs from '../components/InventoryRestockRecs'
import InventoryCreateFbaShipments from '../components/InventoryCreateFbaShipments'

function Inventory () {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [data, setData] = useState(getLocalData('inventoryRecs'))
  const [datetime, setDatetime] = useState(new Date(getLocalData('inventoryRecsDatetime')))

  async function getRecommendations () {
    if (errorMessage) setErrorMessage(null)
    setIsLoading(true)
    const data = await api.getRecs()
    setIsLoading(false)
    setLocalData('inventoryRecs', data)
    setData(data)
    const date = new Date()
    setLocalData('inventoryRecsDatetime', date)
    setDatetime(date)
  }

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        {errorMessage && (
          <Alert color="red" title="Error">
            {errorMessage}
          </Alert>
        )}

        <Title order={2}>Inventory Manager</Title>

        <Group>
          <Button
            onClick={getRecommendations}
            loading={isLoading}
          >
            Get Recommendations
          </Button>

          <InventoryCreateFbaShipments restock={data && data.restockNeeded} />
        </Group>

        {data ? (
          <Stack spacing="xl">
            <Badge size="sm" color="gray" variant="light">
              Synced on {datetime.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "long" })} at {datetime.toLocaleString("en-US", { timeZone: "America/Los_Angeles", timeStyle: "long" })}
            </Badge>

            <Title order={3}>Restock needed</Title>
            <InventoryRestockRecs products={data.restockNeeded} />

            <Title order={3}>No restock needed</Title>
            <InventoryRestockRecs products={data.noRestockNeeded} />
          </Stack>
        ) : null}
      </Stack>
    </Container>
  )
}

export default Inventory
