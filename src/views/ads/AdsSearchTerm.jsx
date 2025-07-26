import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Box, Title, Stack, Text, Group, Table } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import startCase from 'lodash-es/startCase'
import capitalize from 'lodash-es/capitalize'

import NotFound from '@/views/NotFound'
import { useAsync } from '@/hooks/useAsync'
import api from '@/utils/api'
import { numberTypeColumns } from '@/utils/table'
import { getIndexedChartColor } from '@/utils/color'
import ChartLegendDropdown from '@/components/ChartLegendDropdown'

function AdsSearchTerm() {
  const { searchTerm } = useParams()
  const [searchParams] = useSearchParams()
  const keywordId = searchParams.get('keywordId')
  const { run, isLoading } = useAsync()
  const [recordsByDate, setRecordsByDate] = useState([])
  const [recordsAggregate, setRecordsAggregate] = useState({})
  const [visibleColumns, setVisibleColumns] = useState(new Set(['acosClicks7d', 'cost', 'sales7d']))
  
  if (!keywordId) {
    return <NotFound message="The search term has no keyword ID." />
  }
  
  useEffect(() => {
    const fetchData = async () => {
      let recordsByDate = await run(async () => await api.getAdsSearchTerm(searchTerm, keywordId))
      recordsByDate = recordsByDate.map(item => {
        const itemData = { date: new Date(item.date).toLocaleDateString() }
        
        numberTypeColumns.forEach((field) => {
          if (item[field] !== undefined) {
            itemData[field] = parseFloat(item[field] || 0)
          }
        })
        return itemData
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
      setRecordsByDate(recordsByDate)
      
      const recordsAggregate = await run(async () => await api.getAdsSearchTerm(searchTerm, keywordId, true))
      setRecordsAggregate(recordsAggregate)
    }
    fetchData()
  }, [])
  
  return (
    <Stack>
      <Title order={1}>{decodeURIComponent(searchTerm)}</Title>
      <Text>Keyword ID: {keywordId}</Text>

      {recordsByDate.length === 0 && (
        <p>No data available</p>
      )}
      
      <Group>
        <ChartLegendDropdown
            name="Columns"
            items={[...numberTypeColumns]}
            visibleItems={visibleColumns}
            setVisibleItems={setVisibleColumns}
          />
      </Group>
      
      <Box mt="md">
        <LineChart 
          h={400}
          dataKey="date" 
          data={recordsByDate} 
          withLegend
          legendProps={{ verticalAlign: 'bottom' }}
          series={[...visibleColumns].map((column) => ({
            name: column,
            color: getIndexedChartColor(numberTypeColumns.indexOf(column))
          }))}
        />
      </Box>
    
      {Object.keys(recordsAggregate).length > 0 && (
        <Table variant="vertical">
          <Table.Tbody>
            {Object.keys(recordsAggregate).map((key) => (
              <Table.Tr key={key}>
                <Table.Th>{capitalize(startCase(key))}</Table.Th>
                <Table.Td>{recordsAggregate[key]}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  )
}

export default AdsSearchTerm