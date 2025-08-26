import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Stack, Group } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import omit from 'lodash-es/omit'

import { useAsync } from '@/hooks/useAsync'
import api from '@/api'
import Keyword from './Keyword'
import Target from './Target'
import { numberTypeColumns } from '@/utils/table'
import { getIndexedChartColor } from '@/utils/color'
import ChartLegendDropdown from '@/components/ChartLegendDropdown'
import DataList from '@/components/DataList'

function SearchTerm() {
  const { searchTerm } = useParams()
  const [params] = useSearchParams()
  const { run, isLoading, loadingStates } = useAsync()

  const { keywordId, targetId } = Object.fromEntries(params.entries())
  const id = keywordId || targetId

  const [recordsByDate, setRecordsByDate] = useState([])
  const [recordsAggregate, setRecordsAggregate] = useState({})

  const [visibleColumns, setVisibleColumns] = useState(new Set(['acosClicks7d', 'cost', 'sales7d']))


  useEffect(() => {
    run(async () => {
      const recordsByDate = await api.getAdsSearchTerm(searchTerm, id)
      
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
      const recordsAggregate = await api.getAdsSearchTerm(searchTerm, id, true)
      setRecordsAggregate(recordsAggregate)
    }, 'recordsAggregate')
  }, [])


  return (
    <Stack>

      {targetId && (
        <Target
          asin={searchTerm}
          targetId={targetId}
          recordsAggregate={recordsAggregate} 
        />
      )}

      {keywordId && (
        <Keyword
          searchTerm={searchTerm}
          keywordId={keywordId}
          recordsAggregate={recordsAggregate}
        />
      )}

      <Stack>
        <Group>
          <ChartLegendDropdown
              name="Columns"
              items={[...numberTypeColumns]}
              visibleItems={visibleColumns}
              setVisibleItems={setVisibleColumns}
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
