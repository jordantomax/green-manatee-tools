import React from 'react'
import { Text, Group, Badge, Select, Table, Loader } from '@mantine/core'
import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'

const getStateColor = (state) => {
  const colors = { ENABLED: 'green', PAUSED: 'yellow', ARCHIVED: 'gray' }
  return colors[state] || 'blue'
}

export const Keyword = ({ keywordId, keywordText, matchType, state = 'ENABLED', onChange }) => {
  const { isLoading, run } = useAsync()

  const handleStateChange = (newState) => {
    if (newState === state) return
    
    run(async () => {
      const response = await api.updateKeyword(keywordId, { state: newState })
      console.log(response)
      if (onChange) {
        onChange(keywordId, newState)
      }
    })
  }

  return (
    <Table.Tr key={keywordId}>
      <Table.Td>
        <Text size="sm">{keywordText}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">{matchType}</Text>
      </Table.Td>
      <Table.Td>
        <Select
          size="xs"
          radius="xl"
          variant="filled"
          value={state}
          onChange={handleStateChange}
          disabled={isLoading}
          rightSection={isLoading ? <Loader size="xs" /> : null}
          data={[
            { value: 'ENABLED', label: 'Enabled' },
            { value: 'PAUSED', label: 'Paused' },
            { value: 'ARCHIVED', label: 'Archived' }
          ]}
          styles={{ 
            input: { width: 120 },
            dropdown: { width: 120 } 
          }}
        />
      </Table.Td>
    </Table.Tr>
  )
}

export const Keywords = ({ keywords, onChange }) => {
  return (
    <>
      {keywords.length > 0 ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Keyword</Table.Th>
              <Table.Th>Match</Table.Th>
              <Table.Th>State</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {keywords.map((keyword) => (
              <Keyword 
                key={keyword.keywordId} 
                {...keyword} 
                onChange={onChange}
              />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text c="dimmed">No keywords found</Text>
      )}
    </>
  )
}