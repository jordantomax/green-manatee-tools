import React from 'react'
import { useState } from 'react'
import {
  Card,
  Text,
  Button,
  Title,
  Table,
  Box,
  ActionIcon,
  Group
} from '@mantine/core'
import { IconChevronRight, IconX } from '@tabler/icons-react'

import api from '@/api'
import { useError } from '@/contexts/Error'

function Sales ({ sales }) {
  return sales.map((period, i) => {
    const last = i === sales.length - 1
    return (
      <span key={i}>{period}{last ? '' : <IconChevronRight size={14} />}</span>
    )
  })
}

function InventoryProductCard ({ product, onRemove }) {
  const [isLoading, setIsLoading] = useState(false)
  const { showError } = useError()

  async function createFbaShipment () {
    setIsLoading(true)
    try {
      await api.createFbaShipment(product)
    } catch (error) {
      showError(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const fbaRestock = product.restock.fba > 0
  const warehouseRestock = product.restock.warehouse > 0

  return (
    <Card p="0">
      <Box p="md">
        <Group justify="space-between" align="flex-start" gap="xs">
          <Title order={4} style={{ flex: 1 }}>{product.sku}</Title>

          {onRemove && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={onRemove}
              size="sm"
            >
              <IconX size={16} />
            </ActionIcon>
          )}
        </Group>
        <Text size="sm" color="dimmed" mb="xs">{product.name}</Text>
        <Button
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
          <Table.Tr bg={fbaRestock ? "green.1" : "gray.1"} style={{ border: 'none' }}>
            <Table.Td px="md"><Text size="sm" c={fbaRestock ? undefined : "gray.5"}>FBA restock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm" fw={500} c={fbaRestock ? undefined : "gray.5"}>{product.restock.fba}</Text></Table.Td>
          </Table.Tr>
          <Table.Tr bg={warehouseRestock ? "green.1" : "gray.1"} style={{ border: 'none' }}>
            <Table.Td px="md"><Text size="sm" c={warehouseRestock ? undefined : "gray.5"}>Warehouse restock:</Text></Table.Td>
            <Table.Td px="md"><Text size="sm" fw={500} c={warehouseRestock ? undefined : "gray.5"}>{product.restock.warehouse}</Text></Table.Td>
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
