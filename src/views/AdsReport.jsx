import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Title, Paper, Stack, Group, Text, Loader, Breadcrumbs, Anchor } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import api from '@/utils/api'
import DataTable from '@/components/DataTable'
import { useAsync } from '@/hooks/useAsync'
import classes from '@/styles/AdsReport.module.css'

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
      className={classes.breadcrumbAnchor}
    >
      {item.title}
    </Anchor>
  ))
  
  console.log(report)

  return (
    <Container size="md" py="xl">

            {report.status === 'COMPLETED' && report.result && (
              <DataTable 
                data={report.result} 
                title="Report Data"
                tableId={`ads-report-${id}`}
                currencyColumns={['cost', 'costPerClick', 'sales7d', 'sales14d', 'sales30d']}
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
              />
            )}
    </Container>
  )
}

export default AdsReport 