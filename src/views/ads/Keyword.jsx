import { useState, useEffect } from 'react'
import { Title, Stack, Group, Badge } from '@mantine/core'

import NotFound from '@/views/NotFound'
import { useAsync } from '@/hooks/useAsync'
import api from '@/api'
import DataList from '@/components/DataList'
import { KeywordStateSelect } from '@/components/amazon_ads/Keyword'
import NegativeKeywordToggle from '@/components/NegativeKeywordToggle'

function Keyword({ searchTerm, keywordId, recordsByDate, recordsAggregate }) {
  const { run, isLoading, loadingStates } = useAsync()

  const [keyword, setKeyword] = useState(null)
  const [negativeKeywords, setNegativeKeywords] = useState([])
  const activeNegativeKeyword = negativeKeywords.find(k => k.keywordText === searchTerm)

  if (!keywordId) {
    return <NotFound message="The search term has no keyword ID." />
  }
  
  useEffect(() => {
    run(async () => {
      const keyword = await api.getKeywordById(keywordId)
      setKeyword(keyword)
    }, 'keyword')
  }, [])

  useEffect(() => {
    if (recordsAggregate?.adGroupId) {
      run(async () => {
        const negativeKeywords = await api.listNegativeKeywords({ adGroupIds: [recordsAggregate.adGroupId] })
        setNegativeKeywords(negativeKeywords)
      }, 'negativeKeywords')
    }
  }, [recordsAggregate?.adGroupId])
  
  const handleStateChange = (keywordId, newState) => {
    setKeyword(prev => ({ ...prev, state: newState }))
  }
  
  return (
    <Stack>
      <Group align="center">
        <Title order={1}>{decodeURIComponent(searchTerm)}</Title>
        {activeNegativeKeyword && (
          <Badge variant="outline" color="red">
            {activeNegativeKeyword.matchType}
          </Badge>
        )}
      </Group>

      <Group>
        {keyword && (
          <KeywordStateSelect 
            keywordId={keywordId}
            value={keyword?.state} 
            isLoading={loadingStates.keyword || loadingStates.updateKeyword}
            onChange={handleStateChange}
          />
        )}

        <NegativeKeywordToggle 
          negativeKeyword={activeNegativeKeyword}
          setNegativeKeywords={setNegativeKeywords}
          campaignId={recordsAggregate.campaignId}
          adGroupId={recordsAggregate.adGroupId}
          keywordText={searchTerm}
        />
      </Group>

      <DataList 
        data={recordsAggregate}
        keys={[
          { key: 'campaignName', label: 'Campaign', url: `/ads/campaigns/${recordsAggregate.campaignId}` },
          { key: 'adGroupName', label: 'Ad Group', url: `/ads/ad-groups/${recordsAggregate.adGroupId}` },
          { key: 'keyword', label: 'Keyword', url: `/ads/keywords/${keywordId}` },
          { key: 'matchType', label: 'Match', badge: true },
        ]} 
      />
    </Stack>
  )
}

export default Keyword