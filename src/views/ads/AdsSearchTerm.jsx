import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Box, Title, Stack, Text, Group } from '@mantine/core'
import { LineChart } from '@mantine/charts'

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
  const [chartData, setChartData] = useState([])
  const [visibleColumns, setVisibleColumns] = useState(new Set(['acosClicks7d', 'clicks', 'cost', 'sales7d']))
  
  if (!keywordId) {
    return <NotFound message="The search term has no keyword ID." />
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await run(async () => await api.getAdsSearchTerm(searchTerm, keywordId))
      const data = response.map(item => {
        const itemData = { date: new Date(item.date).toLocaleDateString() }
        
        numberTypeColumns.forEach((field) => {
          if (item[field] !== undefined) {
            itemData[field] = parseFloat(item[field] || 0)
          }
        })
        return itemData
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
      setChartData(data)
    }
    fetchData()
  }, [])
  
  return (
    <Stack>
      <Title order={1}>{decodeURIComponent(searchTerm)}</Title>
      <Text>Keyword ID: {keywordId}</Text>

      {chartData.length === 0 && (
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
          data={chartData} 
          withLegend
          legendProps={{ verticalAlign: 'bottom' }}
          series={[...visibleColumns].map((column) => ({
            name: column,
            color: getIndexedChartColor(numberTypeColumns.indexOf(column))
          }))}
        />
      </Box>
    </Stack>
  )
}

export default AdsSearchTerm
