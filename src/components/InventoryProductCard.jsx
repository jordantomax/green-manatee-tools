import { useState } from 'react'
import {
  Card,
  Text,
  Button,
  Badge,
  Title,
  Table,
  Box
} from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'

import api from '../utils/api'

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

      <Table withBorder>
        <Table.Tbody>
          {/* Restock */}
          <Table.Tr>
            <Table.Td><Text size="sm">FBA restock:</Text></Table.Td>
            <Table.Td><Badge color={product.restock.needFbaRestock ? "green" : "gray"}>{product.restock.fba}</Badge></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">Warehouse restock:</Text></Table.Td>
            <Table.Td><Badge color={product.restock.needWarehouseRestock ? "green" : "gray"}>{product.restock.warehouse}</Badge></Table.Td>
          </Table.Tr>
          
          {/* Sales */}
          <Table.Tr>
            <Table.Td colSpan={2}>
              <Box fw={500} c="dimmed" py="xs">Sales</Box>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">30 day sales:</Text></Table.Td>
            <Table.Td><Text size="sm"><Sales sales={product.sales.amzUnitSalesBy30DayPeriods} /></Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">Monthly change:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.sales.amzWeightedMonthlyGrowthRate}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">Forecast sales:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.sales.amzProjectedMonthlyUnitSales}</Text></Table.Td>
          </Table.Tr>
          
          {/* Inventory */}
          <Table.Tr>
            <Table.Td colSpan={2}>
              <Box fw={500} c="dimmed" py="xs">Inventory</Box>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">FBA stock:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.fba.stock}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">FBA inbound:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.fba.inbound}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">AWD stock:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.awd.stock || 0}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">AWD inbound:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.awd.inbound || 0}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><Text size="sm">Warehouse stock:</Text></Table.Td>
            <Table.Td><Text size="sm">{product.warehouse.stock}</Text></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  )
}

export default InventoryProductCard
