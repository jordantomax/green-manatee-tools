import React from 'react'
import { Text, Group } from '@mantine/core'

const Keyword = ({ keywordId, keywordText, matchType }) => {
  return (
    <Group key={keywordId}>
      <Text size="sm">{keywordText}</Text>
      <Text c="dimmed" size="xs">{matchType}</Text>
    </Group>
  )
}

export default Keyword