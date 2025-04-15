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
import { IconChevronRight } from '@tabler/icons-react'

import api from '../utils/api'

function Sales ({ sales }) {
  return sales.map((period, i) => {
    const last = i === sales.length - 1
    return (
      <span key={i}>{period}{last ? '' : <IconChevronRight size={14} />}</span>
    )
  })
}

function InventoryProductCard ({ product }) {
  const [isLoading, setIsLoading] = useState(false)
  async function createFbaShipment () {
    setIsLoading(true)
    await api.createFbaShipment(product)
    setIsLoading(false)
  }

  return (
    <Card p="0">
      <Box p="md">
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
      </Box>

      <Table verticalSpacing="xs">
        <Table.Tbody>
          {/* Restock */}
          <Table.Tr bg={product.restock.needFbaRestock ? "green.2" : "gray.1"} style={{ border: 'none' }}>
            <Table.Td px="md"><Text size="sm" c={product.restock.needFbaRestock ? undefined : "gray.5"}>FBA restock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm" fw={500} c={product.restock.needFbaRestock ? undefined : "gray.5"}>{product.restock.fba}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr bg={product.restock.needWarehouseRestock ? "green.2" : "gray.1"} style={{ border: 'none' }}>
            <Table.Td px="md"><Text size="sm" c={product.restock.needWarehouseRestock ? undefined : "gray.5"}>Warehouse restock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm" fw={500} c={product.restock.needWarehouseRestock ? undefined : "gray.5"}>{product.restock.warehouse}</Text></Table.Td>
          </Table.Tr>
          
          {/* Sales */}
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">90 day sales:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm"><Sales sales={product.sales.amzUnitSalesBy30DayPeriods} /></Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">Monthly change:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.sales.amzWeightedMonthlyGrowthRate}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">Forecast sales:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.sales.amzProjectedMonthlyUnitSales}</Text></Table.Td>
          </Table.Tr>
          
          {/* Inventory */}
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">FBA stock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.fba.stock}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">FBA inbound:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.fba.inbound}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">AWD stock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.awd.stock || 0}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">AWD inbound:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.awd.inbound || 0}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td px="md"><Text size="sm">Warehouse stock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm">{product.warehouse.stock}</Text></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  )
}

export default InventoryProductCard
