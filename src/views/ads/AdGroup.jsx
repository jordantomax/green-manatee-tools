import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Title, Stack, Group, Text, SimpleGrid } from '@mantine/core'

import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'
import Loader from '@/components/Loader'
import { Keywords } from '@/components/amazon_ads/Keywords'

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
        <Keywords keywords={keywords} />
      </Stack>

      <Stack>
        <Title order={2}>Negative Keywords</Title>
        <Keywords keywords={negativeKeywords} />
      </Stack>
    </SimpleGrid>
  )
}

export default AdGroup
