import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Box, Title, Stack, Text } from '@mantine/core'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import NotFound from '@/views/NotFound'
import { useAsync } from '@/hooks/useAsync'
import api from '@/utils/api'

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
      const data = response.map(item => ({
        date: new Date(item.date),
        cost: parseFloat(item.cost || 0)
      })).sort((a, b) => a.date - b.date)
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
        <Title order={2}>Cost Over Time</Title>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => date.toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => date.toLocaleDateString()}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  )
}

export default AdsSearchTerm
