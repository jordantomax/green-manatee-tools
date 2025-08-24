import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Title, Stack, Text, Group, Badge } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import omit from 'lodash-es/omit'

import NotFound from '@/views/NotFound'
import { useAsync } from '@/hooks/useAsync'
import api from '@/api'
import { numberTypeColumns } from '@/utils/table'
import { getIndexedChartColor } from '@/utils/color'
import ChartLegendDropdown from '@/components/ChartLegendDropdown'
import DataList from '@/components/DataList'
import { KeywordState } from '@/components/amazon_ads/Keywords'
import NegativeKeywordToggle from '@/components/NegativeKeywordToggle'

function SearchTerm() {
  const { searchTerm } = useParams()
  const [searchParams] = useSearchParams()
  const { run, isLoading, loadingStates } = useAsync()
  const [keyword, setKeyword] = useState(null)
  const [recordsByDate, setRecordsByDate] = useState([])
  const [recordsAggregate, setRecordsAggregate] = useState({})
  const [visibleColumns, setVisibleColumns] = useState(new Set(['acosClicks7d', 'cost', 'sales7d']))
  const [negativeKeywords, setNegativeKeywords] = useState([])

  const keywordId = searchParams.get('keywordId')
  const activeNegativeKeyword = negativeKeywords.find(k => k.keywordText === searchTerm)

  if (!keywordId) {
    return <NotFound message="The search term has no keyword ID." />
  }
  
  useEffect(() => {
    run(async () => {
      const recordsByDate = await api.getAdsSearchTerm(searchTerm, keywordId)
      
      const processedRecordsByDate = recordsByDate.map(item => {
        const itemData = { date: new Date(item.date).toLocaleDateString() }
        
        numberTypeColumns.forEach((field) => {
          if (item[field] !== undefined) {
            itemData[field] = parseFloat(item[field] || 0)
          }
        })
        return itemData
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
      
      setRecordsByDate(processedRecordsByDate)
    }, 'recordsByDate')

    run(async () => {
      const recordsAggregate = await api.getAdsSearchTerm(searchTerm, keywordId, true)
      setRecordsAggregate(recordsAggregate)
    }, 'recordsAggregate')

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
  
  useEffect(() => {
    if (recordsAggregate?.matchType === 'TARGETING_EXPRESSION') {
      run(async () => {
      const asin = searchTerm
      const adGroupId = recordsAggregate.adGroupId
        // const productTarget = await api.getProductTarget(asin, adGroupId)
        // console.log(productTarget)
      }, 'productTarget')
    }
  }, [recordsAggregate?.matchType])
  
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

      {keyword && (
        <KeywordState 
          keywordId={keywordId}
          value={keyword?.state} 
          isLoading={loadingStates.keyword}
          onChange={(keywordId, newState) => {
            setKeyword(prev => ({ ...prev, state: newState }))
          }}
        />
      )}

      <DataList 
        data={recordsAggregate}
        keys={[
          { key: 'campaignName', label: 'Campaign', url: `/ads/campaigns/${recordsAggregate.campaignId}` },
          { key: 'adGroupName', label: 'Ad Group', url: `/ads/ad-groups/${recordsAggregate.adGroupId}` },
          { key: 'keyword', label: 'Keyword', url: `/ads/keywords/${keywordId}` },
          { key: 'matchType', label: 'Match', badge: true },
        ]} 
      />

      <Stack>
        <Group>
          <ChartLegendDropdown
              name="Columns"
              items={[...numberTypeColumns]}
              visibleItems={visibleColumns}
              setVisibleItems={setVisibleColumns}
            />
          <NegativeKeywordToggle 
            negativeKeyword={activeNegativeKeyword}
            setNegativeKeywords={setNegativeKeywords}
            campaignId={recordsAggregate.campaignId}
            adGroupId={recordsAggregate.adGroupId}
            keywordText={searchTerm}
          />
        </Group>

        <LineChart 
          h={300}
          dataKey="date" 
          data={recordsByDate} 
          withLegend
          legendProps={{ verticalAlign: 'bottom' }}
          series={[...visibleColumns].map((column) => ({
            name: column,
            color: getIndexedChartColor(numberTypeColumns.indexOf(column))
          }))}
        />
      </Stack>
    
      {Object.keys(recordsAggregate).length > 0 && (
        <DataList 
          data={omit(recordsAggregate, ['keywordId', 'searchTerm', 'matchType', 'campaignName', 'adGroupName', 'campaignId', 'adGroupId', 'adKeywordStatus'])}
        />
      )}
    </Stack>
  )
}

export default SearchTerm