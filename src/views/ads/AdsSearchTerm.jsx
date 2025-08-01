import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Title, Stack, Text, Group, Table, TextInput } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import startCase from 'lodash-es/startCase'
import capitalize from 'lodash-es/capitalize'
import omit from 'lodash-es/omit'
import { IconSearch } from '@tabler/icons-react'

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
  const [filter, setFilter] = useState('')
  const [negativeKeywords, setNegativeKeywords] = useState([])
  
  const keywordId = searchParams.get('keywordId')

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
  
  return (
    <Stack>
      <Title order={1}>{decodeURIComponent(searchTerm)}</Title>
      <DataList 
        data={{...recordsAggregate, keywordId}}
        visibleKeys={['campaignName', 'keyword', 'keywordId']} 
      />

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
        <>
          <TextInput
            placeholder="Search metrics..."
            value={filter}
            onChange={(event) => setFilter(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
          />
          
          <Table variant="vertical">
            <Table.Tbody>
              {Object.entries(
                omit(recordsAggregate, ['keywordId', 'searchTerm'])
              )
                .filter(([key, value]) => 
                  filter === '' || 
                  key.toLowerCase().includes(filter.toLowerCase()) ||
                  String(value).toLowerCase().includes(filter.toLowerCase())
                )
                .map(([key, value]) => (
                  <Table.Tr key={key}>
                    <Table.Th>{capitalize(startCase(key))}</Table.Th>
                    <Table.Td>{value}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Stack>
  )
}

export default AdsSearchTerm