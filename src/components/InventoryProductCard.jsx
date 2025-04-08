import { useState } from 'react'
import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  Badge,
  Title
} from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'

import api from '../utils/api'

function RestockUnits ({ product }) {
  const {
    fba,
    warehouse,
    needFbaRestock,
    needWarehouseRestock
  } = product.restock
  
  return (
    <>
      <Group position="apart">
        <Text size="sm">FBA restock:</Text>
        <Badge color={needFbaRestock ? "green" : "gray"}>{fba}</Badge>
      </Group>

      <Group position="apart">
        <Text size="sm">Warehouse restock:</Text>
        <Badge color={needWarehouseRestock ? "green" : "gray"}>{warehouse}</Badge>
      </Group>
    </>
  )
}

function Sales ({ sales }) {
  return sales.map((period, i) => {
    const last = i === sales.length - 1
    return (
      <span key={i}>{period}{last ? '' : ', '}</span>
    )
  })
}

function InventoryProductCard ({ product }) {
  const [isLoading, setIsLoading] = useState(false)
  async function createFbaShipment () {
    setIsLoading(true)
    await api.createFbaShipments([product])
    setIsLoading(false)
  }

  return (
    <Card>
      <Card.Section p="md" withBorder>
        <Title order={4}>{product.sku}</Title>
        <Text size="sm" color="dimmed" mb="xs">{product.name}</Text>
        <Button
          disabled={!product.restock.needFbaRestock}
          onClick={createFbaShipment}
          loading={isLoading}
          size="xs"
          variant="light"
        >
          Create FBA Shipment
        </Button>
      </Card.Section>

      <Card.Section p="md" withBorder>
        <RestockUnits product={product} />
      </Card.Section>

      <Card.Section p="md" withBorder>
        <Group>
          <Text size="sm">Projected monthly sales:</Text>
          <Text size="sm">{product.sales.amzProjectedMonthlyUnitSales}</Text>
        </Group>
        <Group>
          <Text size="sm">30 day sales <IconArrowRight /> new:</Text>
          <Text size="sm"><Sales sales={product.sales.amzUnitSalesBy30DayPeriods} /></Text>
        </Group>
        <Group>
          <Text size="sm">Monthly growth rate:</Text>
          <Text size="sm">{product.sales.amzWeightedMonthlyGrowthRate}</Text>
        </Group>
      </Card.Section>

      <Card.Section p="md" withBorder>
        <Group justify="space-between">
          <Text size="sm">FBA stock:</Text>
          <Text size="sm">{product.fba.stock}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">FBA inbound:</Text>
          <Text size="sm">{product.fba.inbound}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">AWD stock:</Text>
          <Text size="sm">{product.awd.stock || 0}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">AWD inbound:</Text>
          <Text size="sm">{product.awd.inbound || 0}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">Warehouse stock:</Text>
          <Text size="sm">{product.warehouse.stock}</Text>
        </Group>
      </Card.Section>
    </Card>
  )
}

export default InventoryProductCard
