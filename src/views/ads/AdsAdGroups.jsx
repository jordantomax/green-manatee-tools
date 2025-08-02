import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Title, Stack, Group, Text } from '@mantine/core'

import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'

function AdsAdGroups() {
  const { adGroupId } = useParams()
  const { run, isLoading } = useAsync()
  const [negativeKeywords, setNegativeKeywords] = useState([])

  useEffect(() => {
    run(async () => {
      console.log('adGroupId', adGroupId)
      const negativeKeywords = await api.getNegativeKeywordsByAdGroup(adGroupId)
      setNegativeKeywords(negativeKeywords)
    })
  }, [])

  return (
    <Stack>
      <Title order={2}>Negative Keywords</Title>

      {negativeKeywords.length > 0 ? negativeKeywords.map((keyword) => (
        <Group key={keyword.keywordId}>
          <Text size="sm">{keyword.keywordText}</Text>
          <Text c="dimmed" size="xs">{keyword.matchType}</Text>
        </Group>
      )) : (
        <Text c="dimmed">No negative keywords found</Text>
      )}
    </Stack>
  )
}

export default AdsAdGroups
