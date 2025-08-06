import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Title, Stack, Group, Text, SimpleGrid } from '@mantine/core'

import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'
import Loader from '@/components/Loader'
import Keyword from '@/components/amazon_ads/Keyword'

function AdGroup() {
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
          <Keyword key={keyword.keywordId} {...keyword} />
        )) : (
          <Text c="dimmed">No keywords found</Text>
        )}
        
      </Stack>

      <Stack>
        <Title order={2}>Negative Keywords</Title>
      
        {negativeKeywords.length > 0 ? negativeKeywords.map((keyword) => (
          <Keyword key={keyword.keywordId} {...keyword} />
        )) : (
          <Text c="dimmed">No negative keywords found</Text>
        )}
      </Stack>
    </SimpleGrid>
  )
}

export default AdGroup
