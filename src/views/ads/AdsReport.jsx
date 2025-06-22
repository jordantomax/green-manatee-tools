import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Title, Paper, Stack, Group, Text, Loader, Breadcrumbs, Anchor } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import api from '@/utils/api'
import DataTable from '@/components/DataTable'
import { useAsync } from '@/hooks/useAsync'
import classes from '@/styles/AdsReport.module.css'

function AdsReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [report, setReport] = useState(null)
  const { isLoading, run } = useAsync()

  // Pagination from query params
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '100', 10)
  const handlePageChange = (page) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('page', page)
      return params
    })
  }
  const handlePageSizeChange = (size) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('pageSize', size)
      params.set('page', 1) // Reset to first page on size change
      return params
    })
  }

  useEffect(() => {
    const fetchReport = async () => {
      const data = await run(async () => await api.getAdsReport(id))
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
      className={classes.breadcrumbAnchor}
    >
      {item.title}
    </Anchor>
  ))

  return (
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
            <DataTable
              data={report.result}
              title="Report Data"
              tableId={`ads-report-${id}`}
              currencyColumns={['cost', 'costPerClick', 'sales7d', 'sales14d', 'sales30d']}
              columnFormats={{
                '/^acos/': { type: 'percent', decimals: 1 },
                'roasClicks7d': { type: 'number', decimals: 2 },
                'clicks': { type: 'number', decimals: 0 },
                'campaignId': { 
                  type: 'link',
                  urlTemplate: 'https://advertising.amazon.com/cm/sp/campaigns/{campaignId}/ad-groups'
                },
                'adGroupId': {
                  type: 'link',
                  urlTemplate: 'https://advertising.amazon.com/cm/sp/campaigns/{campaignId}/ad-groups/{adGroupId}/ads'
                },
                'keywordId': {
                  type: 'link',
                  urlTemplate: 'https://advertising.amazon.com/cm/sp/campaigns/{campaignId}/ad-groups/{adGroupId}/keywords'
                },
                'keyword': {
                  type: 'link',
                  urlTemplate: (value) => {
                    const asinMatch = String(value).match(/asin="([^"]+)"/);
                    if (asinMatch && asinMatch[1]) {
                      return `https://www.amazon.com/dp/${asinMatch[1]}`;
                    } else {
                      return `https://www.amazon.com/s?k=${encodeURIComponent(String(value))}`;
                    }
                  }
                }
              }}
              columnOrder={['searchTerm', 'keyword', 'matchType', 'cost']}
              paginationFromQueryParams
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}

export default AdsReport 