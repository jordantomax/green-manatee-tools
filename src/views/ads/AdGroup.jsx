import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Title, Stack, SimpleGrid, Loader } from '@mantine/core'

import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import { KeywordRows } from '@/components/amazon_ads/Keyword'

function AdGroup() {
  const { adGroupId } = useParams()
  const { run, isLoading } = useAsync()
  const [keywords, setKeywords] = useState([])
  const [negativeKeywords, setNegativeKeywords] = useState([])

  useEffect(() => {
    run(async () => {
      const [negativeKeywords, keywords] = await Promise.all([
        api.listNegativeKeywords({ adGroupIds: [adGroupId] }),
        api.listKeywords({ adGroupIds: [adGroupId] })
      ])
      setNegativeKeywords(negativeKeywords)
      setKeywords(keywords)
    })
  }, [])

  const createKeywordHandler = (setter) => (keywordId, newState) => {
    setter(prevKeywords => 
      prevKeywords.map(keyword => 
        keyword.keywordId === keywordId 
          ? { ...keyword, state: newState }
          : keyword
      )
    )
  }
  
  if (isLoading) return <Loader />

  return (
    <SimpleGrid cols={2} spacing="xs">
      <Stack>
        <Title order={2}>Keywords</Title>
        <KeywordRows
          keywords={keywords}
          onChange={createKeywordHandler(setKeywords)}
        />
      </Stack>

      <Stack>
        <Title order={2}>Negative Keywords</Title>
        <KeywordRows
          keywords={negativeKeywords}
          onChange={createKeywordHandler(setNegativeKeywords)}
          isNegative={true}
        />
      </Stack>
    </SimpleGrid>
  )
}

export default AdGroup
