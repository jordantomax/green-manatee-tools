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
import { IconChevronRight, IconCheck } from '@tabler/icons-react'

import api from '@/api'
import { useNotification } from '@/contexts/Notification'

function Sales ({ sales }) {
  return sales.map((period, i) => {
    const last = i === sales.length - 1
    return (
      <span key={i}>{period}{last ? '' : <IconChevronRight size={14} />}</span>
    )
  })
}

function InventoryRestockRec ({ recommendation, location, locationLabel, isDone, onDone }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { showNotification } = useNotification()
  
  async function handleCreateShipment () {
    if (!location) {
      showNotification('error', "Location is required to create a shipment")
      return
    }
    
    setIsLoading(true)
    try {
      const cartonQty = Math.ceil(recommendation.restock[location].restockQty/recommendation.cartonUnitQty) + 1
      const res = await api.createOutShipment(recommendation, location, cartonQty)
      
      if (res?.metadata?.type === "insufficientStock") {
        showNotification(
          'warning',
          `Insufficient stock, shipment created with ${res.metadata.availableUnits} available units`
        )
      }
      
      onDone(recommendation.product.sku)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card p="0" shadow="0">
      <Box p="md">
        <Group justify="space-between" align="flex-start" gap="xs">
          <Title order={4} style={{ flex: 1 }}>{recommendation.product.sku}</Title>

          {onDone && (
            <ActionIcon
              variant={isDone ? "filled" : "light"}
              color={isDone ? "green" : "gray"}
              onClick={onDone}
              size="sm"
            >
              <IconCheck size={18} />
            </ActionIcon>
          )}
        </Group>

        <Text size="sm" color="dimmed">{recommendation.product.name}</Text>

        {!isDone && (location == 'fba' || location == 'awd') && (
          <Button
            onClick={handleCreateShipment}
            loading={isLoading}
            size="xs"
            mt="xs"
            variant="light"
          >
            {`Create ${locationLabel} Shipment`}
          </Button>
        )}
      </Box>

      {!isDone && (
        <Table verticalSpacing="xs">
          <Table.Tbody>
            {/* Restock */}
            {location && (
              <Table.Tr bg={"green.1"} style={{ border: 'none' }}>
                <Table.Td px="md"><Text size="sm">{locationLabel} restock:</Text></Table.Td>
                <Table.Td px="md"><Text size="sm" fw={500}>{recommendation.restock[location].restockQty}</Text></Table.Td>
              </Table.Tr>
            )}
            
            {/* Sales */}

            <Table.Tr>
              <Table.Td px="md"><Text size="sm">90 day sales:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm"><Sales sales={recommendation.sales.amzUnitSalesBy30DayPeriods} /></Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">Monthly change:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.sales.amzWeightedMonthlyGrowthRate}</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">Forecast sales:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.sales.amzProjectedMonthlyUnitSales}</Text></Table.Td>
            </Table.Tr>
            
            {/* Inventory */}
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">FBA stock:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.fba.stock}</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">FBA inbound:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.fba.inbound}</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">AWD stock:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.awd.stock || 0}</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">AWD inbound:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.awd.inbound || 0}</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td px="md"><Text size="sm">Warehouse stock:</Text></Table.Td>
              <Table.Td px="md"><Text size="sm">{recommendation.warehouse.stock}</Text></Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      )}
    </Card>
  )
}

export default InventoryRestockRec
