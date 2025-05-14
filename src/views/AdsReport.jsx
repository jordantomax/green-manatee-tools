import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Title, Paper, Stack, Group, Text, Loader, Breadcrumbs, Anchor } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import api from '@/utils/api'
import DynamicTable from '@/components/DynamicTable'
import { useAsync } from '@/hooks/useAsync'

function AdsReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const { isLoading, run } = useAsync()

  useEffect(() => {
    const fetchReport = async () => {
      const data = await run(() => api.getAdsReport(id))
      setReport(data)
    }
    fetchReport()
  }, [id])

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    )
  }

  if (!report) {
    return (
      <Container size="md" py="xl">
        <Text>Report not found</Text>
      </Container>
    )
  }

  const items = [
    { title: 'Ads', href: '/ads' },
    { title: report.reportType, href: '#' }
  ].map((item, index) => (
    <Anchor
      key={index}
      component="button"
      onClick={() => item.href !== '#' && navigate(item.href)}
      data-active={item.href === '#'}
    >
      {item.title}
    </Anchor>
  ))

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Breadcrumbs separator={<IconChevronRight size={16} />}>
          {items}
        </Breadcrumbs>

        <Paper withBorder p="lg">
          <Stack gap="md">
            <Title order={2}>Report Details</Title>

            <Stack gap="xs">
              <Group>
                <Text fw={500}>Type:</Text>
                <Text>{report.reportType}</Text>
              </Group>
              <Group>
                <Text fw={500}>Date Range:</Text>
                <Text>{report.startDate.split('T')[0]} to {report.endDate.split('T')[0]}</Text>
              </Group>
              <Group>
                <Text fw={500}>Status:</Text>
                <Text>{report.status}</Text>
              </Group>
              <Group>
                <Text fw={500}>Created:</Text>
                <Text>{new Date(report.createdAt).toLocaleString()}</Text>
              </Group>
            </Stack>

            {report.status === 'COMPLETED' && report.result && (
              <DynamicTable 
                data={report.result} 
                title="Report Data"
                columnFormats={{
                  'acosClicks7d': { type: 'number', decimals: 2 },
                  'roasClicks7d': { type: 'number', decimals: 2 },
                  'clicks': { type: 'number', decimals: 0 },
                  'campaignId': { 
                    type: 'link',
                    urlTemplate: 'https://advertising.amazon.com/cm/sp/campaigns/{campaignId}/ad-groups'
                  },
                  'adGroupId': {
                    type: 'link',
                    urlTemplate: 'https://advertising.amazon.com/cm/sp/campaigns/{campaignId}/ad-groups/{adGroupId}/ads'
                  }
                }}
              />
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default AdsReport 