import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Title, Stack, Text, Group, Button } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import omit from 'lodash-es/omit'

import NotFound from '@/views/NotFound'
import { useAsync } from '@/hooks/useAsync'
import api from '@/utils/api'
import { numberTypeColumns } from '@/utils/table'
import { getIndexedChartColor } from '@/utils/color'
import ChartLegendDropdown from '@/components/ChartLegendDropdown'
import DataList from '@/components/DataList'

function AdsSearchTerm() {
  const { searchTerm } = useParams()
  const [searchParams] = useSearchParams()
  const { run, isLoading } = useAsync()
  const [recordsByDate, setRecordsByDate] = useState([])
  const [recordsAggregate, setRecordsAggregate] = useState({})
  const [visibleColumns, setVisibleColumns] = useState(new Set(['acosClicks7d', 'cost', 'sales7d']))
  const [negativeKeywords, setNegativeKeywords] = useState([])
  
  const keywordId = searchParams.get('keywordId')
  const negativeKeyword = negativeKeywords.find(k => k.keywordText === searchTerm)

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
    })
  }, [])
  
  useEffect(() => {
    run(async () => {
      const recordsAggregate = await api.getAdsSearchTerm(searchTerm, keywordId, true)
      setRecordsAggregate(recordsAggregate)
    })
  }, [])
  
  useEffect(() => {
    if (recordsAggregate?.adGroupId) {
      run(async () => {
        const negativeKeywords = await api.getNegativeKeywordsByAdGroup(recordsAggregate.adGroupId)
        setNegativeKeywords(negativeKeywords)
      })
    }
  }, [recordsAggregate?.adGroupId])
  
  const createNegativeKeyword = () => {
    run(async () => {
      const negativeKeyword = await api.createNegativeKeyword(
        recordsAggregate.campaignId,
        recordsAggregate.adGroupId,
        searchTerm,
        'NEGATIVE_EXACT'
      )
    })
  }
  
  const deleteNegativeKeyword = () => {
    run(async () => {
      await api.deleteNegativeKeyword(negativeKeyword.keywordId)
    })
  }
  
  return (
    <Stack>
      <Title order={1}>{decodeURIComponent(searchTerm)}</Title>
      <DataList 
        data={recordsAggregate}
        keys={[
          { key: 'campaignName', label: 'Campaign', url: `/ads/campaigns/${recordsAggregate.campaignId}` },
          { key: 'adGroupName', label: 'Ad Group', url: `/ads/ad-groups/${recordsAggregate.adGroupId}`},
          { key: 'keyword', label: 'Keyword', url: `/ads/keywords/${keywordId}`},
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
          <Button 
            loading={isLoading} 
            variant="light"
            onClick={negativeKeyword ? deleteNegativeKeyword : createNegativeKeyword}
          >
            {negativeKeyword ? 'Remove Negative Keyword' : 'Add Negative Keyword'}
          </Button>
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
    
      <Stack gap="xs" mb="xl">
        <Title order={5}>Ad Group Negative Keywords</Title>

        {negativeKeywords.length > 0 ? negativeKeywords.map((keyword) => (
          <Group key={keyword.keywordId}>
            <Text size="sm">{keyword.keywordText}</Text>
            <Text c="dimmed" size="xs">{keyword.matchType}</Text>
          </Group>
        )) : (
          <Text c="dimmed">No negative keywords found</Text>
        )}
      </Stack>
    
      {Object.keys(recordsAggregate).length > 0 && (
        <DataList 
          data={omit(recordsAggregate, ['keywordId', 'searchTerm'])}
        />
      )}
    </Stack>
  )
}

export default AdsSearchTerm