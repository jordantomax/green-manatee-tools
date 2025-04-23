import React, { useState, useEffect } from 'react'
import { Stack, Checkbox, Group, Text, Button, Modal, Table, Badge } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

import { setLocalData, getLocalData } from '@/utils/storage'
import api from '@/utils/api'

function Shipments ({ children, inline = false }) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [shipments, setShipments] = useState([])
  const [includeDelivered, setIncludeDelivered] = useState(false)
  const [opened, setOpened] = useState(false)

  async function getShipments (forceUpdate) {
    setIsLoading(true)
    try {
      let data = getLocalData('shipments')
      let body = {}

      if (!includeDelivered) {
        body = {
          filter: {
            property: 'Delivered',
            checkbox: {
              equals: false
            }
          }
        }
      }

      if (!data || forceUpdate) {
        data = await api.queryResources('shipments', body)
        setLocalData('shipments', data)
      }
      setData(data)
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (inline || opened) {
      getShipments(false)
    }
  }, [includeDelivered, opened, inline])

  function handleCheck (shipment) {
    const newShipments = [...shipments]
    const checkedShipmentIndex = newShipments.findIndex(s => s.id === shipment.id)
    if (checkedShipmentIndex >= 0) {
      newShipments.splice(checkedShipmentIndex, 1)
    } else {
      newShipments.push(shipment)
    }
    setShipments(newShipments)
  }

  // Create context object with all the values and handlers children might need
  const context = {
    isLoading,
    shipments,
    data,
    includeDelivered,
    setOpened,
    handleCheck,
    getShipments,
    setIncludeDelivered
  }

  const content = (
    <Stack gap="md">
      <Group>
        {/* Render children with context */}
        {typeof children === 'function' ? children(context) : children}

        <Button 
          variant="light" 
          leftSection={<IconRefresh size={16} />}
          onClick={() => getShipments(true)}
          loading={isLoading}
        >
          Refresh
        </Button>

        <Checkbox
          label="Include Delivered"
          styles={{ label: { marginBottom: 0 } }}
          checked={includeDelivered}
          onChange={(event) => setIncludeDelivered(event.currentTarget.checked)}
        />
      </Group>

      {data ? (
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}></Table.Th>
              <Table.Th>Shipment ID</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map(shipment => (
              <Table.Tr 
                key={shipment.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCheck(shipment)}
                >
                <Table.Td>
                  <Checkbox
                    checked={shipments.find(s => s.id === shipment.id) || false}
                    onChange={() => handleCheck(shipment)}
                  />
                </Table.Td>
                <Table.Td>{shipment.properties?.id?.value || 'No ID'}</Table.Td>
                <Table.Td>
                  <Badge 
                    color={shipment.properties?.Delivered?.value ? 'green' : 'gray'}
                    variant='light'
                  >
                    {shipment.properties?.Delivered?.value ? 'Delivered' : 'Pending'}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text c="dimmed">Loading shipments...</Text>
      )}
    </Stack>
  )

  if (inline) {
    return content
  }

  return (
    <>
      <Button onClick={() => setOpened(true)}>Select Notion Shipments</Button>
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)}
        title="Notion Shipments"
      >
        {content}
      </Modal>
    </>
  )
}

export default Shipments