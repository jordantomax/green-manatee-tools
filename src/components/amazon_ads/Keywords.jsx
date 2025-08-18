import React from 'react'
import { isFunction } from 'lodash'
import { Text, Select, Table, Loader } from '@mantine/core'

import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'

export const KeywordState = ({ keywordId, value, onChange, isLoading: externalLoading }) => {
  const { isLoading, run } = useAsync()

  const handleChange = (newState) => {
    if (newState === value) return
    
    run(async () => {
      await api.updateKeyword(keywordId, { state: newState })
      isFunction(onChange) && onChange(keywordId, newState)
    })
  }

  return (
    <Select
      size="xs"
      radius="xl"
      variant="filled"
      value={value}
      onChange={handleChange}
      disabled={externalLoading || isLoading}
      rightSection={(externalLoading || isLoading) ? <Loader size="xs" /> : null}
      data={[
        { value: 'ENABLED', label: 'Enabled' },
        { value: 'PAUSED', label: 'Paused' },
        { value: 'ARCHIVED', label: 'Archived' }
      ]}
      styles={{ 
        wrapper: { width: 120 },
        dropdown: { width: 120 } 
      }}
    />
  )
}

export const Keyword = ({ keywordId, keywordText, matchType, state = 'ENABLED', onChange }) => {
  return (
    <Table.Tr key={keywordId}>
      <Table.Td>
        <Text size="sm">{keywordText}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">{matchType}</Text>
      </Table.Td>
      <Table.Td>
        <KeywordState 
          keywordId={keywordId}
          value={state}
          onChange={onChange}
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