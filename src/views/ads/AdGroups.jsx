import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Title, Stack, Group, Text, SimpleGrid } from '@mantine/core'

import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'
import Loader from '@/components/Loader'

function AdGroups() {
  const { adGroupId } = useParams()
  const { run, isLoading } = useAsync()
  const [keywords, setKeywords] = useState([])
  const [negativeKeywords, setNegativeKeywords] = useState([])

  useEffect(() => {
    run(async () => {
      const [negativeKeywords, keywords] = await Promise.all([
        api.getNegativeKeywordsByAdGroup(adGroupId),
        api.getKeywordsByAdGroup(adGroupId)
      ])
      setNegativeKeywords(negativeKeywords)
      setKeywords(keywords)
    })
  }, [])
  
  if (isLoading) return <Loader />

  return (
    <SimpleGrid cols={2} spacing="xs">
      <Stack>
        <Title order={2}>Keywords</Title>

        {keywords.length > 0 ? keywords.map((keyword) => (
          <Group key={keyword.keywordId}>
            <Text size="sm">{keyword.keywordText}</Text>
            <Text c="dimmed" size="xs">{keyword.matchType}</Text>
          </Group>
        )) : (
          <Text c="dimmed">No keywords found</Text>
        )}
        
      </Stack>

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
    </SimpleGrid>
  )
}

export default AdGroups
