import React from 'react'
import { Text, Table } from '@mantine/core'
import isFunction from 'lodash-es/isFunction'

import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import StateSelect from '@/components/amazon-ads/StateSelect'


export const KeywordStateSelect = ({ 
  keywordId,
  value,
  onChange,
  isLoading: externalLoading,
  isNegative = false
}) => {
  const { run, isLoading } = useAsync()
  const method = isNegative ? api.updateNegativeKeyword : api.updateKeyword

  const handleStateChange = (newState) => {
    run(async () => {
      await method(keywordId, { state: newState })
      isFunction(onChange) && onChange(keywordId, newState)
    })
  }

  return (
    <StateSelect 
      value={value}
      onChange={handleStateChange}
      isLoading={isLoading || externalLoading}
    />
  )
}

export const KeywordRows = ({ keywords, onChange, isNegative = false }) => {
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
            {keywords.map(({ keywordId, keywordText, matchType, state }) => (
              <Table.Tr key={keywordId}>
                <Table.Td>
                  <Text size="sm">{keywordText}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">{matchType}</Text>
                </Table.Td>
                <Table.Td>
                  <KeywordStateSelect 
                    keywordId={keywordId}
                    value={state}
                    onChange={onChange}
                    isNegative={isNegative}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text c="dimmed">No keywords found</Text>
      )}
    </>
  )
}