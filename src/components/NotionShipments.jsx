import React, { useState, useEffect } from 'react'
import { Stack, Checkbox, Group, Switch, Text, Paper, Button, Modal, Table, Badge, Loader } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

import { setLocalData, getLocalData } from '../utils/storage'
import { NOTION_SHIPMENTS_DB_ID } from '../constants'
import notion from '../utils/notion'

function NotionShipments ({ handleSelectShipment, params, inline = false }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSelect, setIsLoadingSelect] = useState(false)
  const [data, setData] = useState(null)
  const [shipments, setShipments] = useState([])
  const [includeDelivered, setIncludeDelivered] = useState(false)
  const [opened, setOpened] = useState(false)

  async function getShipments (forceUpdate) {
    setIsLoading(true)
    let data = getLocalData('notionShipments')
    let params = {}

    if (!includeDelivered) {
      params = {
        filter: {
          property: 'Delivered',
          checkbox: {
            equals: false
          }
        }
      }
    }

    if (!data || forceUpdate) {
      const res = await notion.dbQuery(NOTION_SHIPMENTS_DB_ID, params)
      data = res.results
    }
    setIsLoading(false)
    setLocalData('notionShipments', data)
    setData(data)
  }

  useEffect(() => {
    if (inline || opened) {
      getShipments(false)
    }
  }, [includeDelivered, opened, inline])

  async function handleClick () {
    await setIsLoadingSelect(true)
    await handleSelectShipment(shipments)
    await setIsLoadingSelect(false)
    setOpened(false)
  }

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

  const content = (
    <>
      <Group mb="md" position="apart">
        <Switch
          label="Include delivered shipments"
          checked={includeDelivered}
          onChange={(event) => setIncludeDelivered(event.currentTarget.checked)}
        />
        <Button 
          variant="light" 
          leftIcon={<IconRefresh size={16} />}
          onClick={() => getShipments(true)}
          loading={isLoading}
        >
          Refresh
        </Button>
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
                <Table.Td>{shipment.properties?.id?.title[0]?.plainText}</Table.Td>
                <Table.Td>
                  <Badge color={shipment.properties?.Delivered?.checkbox ? 'green' : 'blue'}>
                    {shipment.properties?.Delivered?.checkbox ? 'Delivered' : 'Pending'}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text c="dimmed">Loading shipments...</Text>
      )}

      <Group justify="flex-end" mt="xl">
        {!inline && <Button variant="light" onClick={() => setOpened(false)}>Cancel</Button>}
        <Button 
          loading={isLoadingSelect}
          onClick={handleClick}
          disabled={shipments.length === 0}
        >
          Select Shipments
        </Button>
      </Group>
    </>
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
        title="Shipments"
        size="md"
      >
        {content}
      </Modal>
    </>
  )
}

export default NotionShipments
