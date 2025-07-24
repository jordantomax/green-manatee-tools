import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Box, Title, Stack, Text } from '@mantine/core'
import { LineChart } from '@mantine/charts'

import NotFound from '@/views/NotFound'
import { useAsync } from '@/hooks/useAsync'
import api from '@/utils/api'
import { numberTypeColumns } from '@/utils/table'
import { CHART_COLORS } from '@/utils/color'

function AdsSearchTerm() {
  const { searchTerm } = useParams()
  const [searchParams] = useSearchParams()
  const keywordId = searchParams.get('keywordId')
  const { run, isLoading } = useAsync()
  const [chartData, setChartData] = useState([])

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
      <Title order={1}>Search Term Details</Title>
      <Text>Search Term: {decodeURIComponent(searchTerm)}</Text>
      <Text>Keyword ID: {keywordId}</Text>
      
      {chartData.length === 0 && (
        <p>No data available</p>
      )}
    
      <Box style={{ width: '100%', height: 400, marginTop: 20 }}>
        <LineChart 
          h={600}
          dataKey="date" 
          data={chartData} 
          withLegend
          series={[...numberTypeColumns].sort().map((column, index) => ({
            name: column,
            color: CHART_COLORS[index % CHART_COLORS.length]
          }))} 
        />
      </Box>
    </Stack>
  )
}

export default AdsSearchTerm
