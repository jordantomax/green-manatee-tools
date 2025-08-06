import React from 'react'
import { Text, Group } from '@mantine/core'

export const Keyword = ({ keywordId, keywordText, matchType }) => {
  return (
    <Group key={keywordId}>
      <Text size="sm">{keywordText}</Text>
      <Text c="dimmed" size="xs">{matchType}</Text>
    </Group>
  )
}

export const Keywords = ({ keywords }) => {
  return (
    <>
      {keywords.length > 0 ? keywords.map((keyword) => (
        <Keyword key={keyword.keywordId} {...keyword} />
      )) : (
        <Text c="dimmed">No keywords found</Text>
      )}
    </>
  )
}