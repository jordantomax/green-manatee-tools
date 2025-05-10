import React, { useState, useEffect } from 'react'
import { Container, Title, Paper, Select, Button, Stack, Group, Text, Table } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { IconRefresh } from '@tabler/icons-react'
import api from '@/utils/api'

function Ads() {
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState({})

  useEffect(() => {
    handleRefreshReports()
  }, [])

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 1)
  const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]

  const form = useForm({
    initialValues: {
      reportType: '',
      startDate: oneMonthAgoStr,
      endDate: yesterdayStr
    },
    validate: {
      reportType: (value) => (!value ? 'Report type is required' : null),
      startDate: (value) => (!value ? 'Start date is required' : null),
      endDate: (value) => (!value ? 'End date is required' : null)
    }
  })

  const handleRefreshReports = async () => {
    setIsLoading(true)
    const data = await api.getAdsReports()
    setReports(data)
    setIsLoading(false)
  }

  const handleCreateReport = async (values) => {
    setIsLoading(true)
    await api.createAdsReport(values)
    await handleRefreshReports()
    setIsLoading(false)
  }

  const handleGetReport = async (report) => {
    setLoadingReports(prev => ({ ...prev, [report.id]: true }))
    try {
      const updatedReport = await api.getAdsReport(report.id)
      console.log('Original report:', report)
      console.log('Updated report:', updatedReport)
      setReports(prev => prev.map(r => r.id === report.id ? updatedReport : r))
    } finally {
      setLoadingReports(prev => ({ ...prev, [report.id]: false }))
    }
  }

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={2}>Ads Reports</Title>
            <Button
              variant="light"
              onClick={handleRefreshReports}
              loading={isLoading}
              leftSection={<IconRefresh size={16} />}
            >
              Refresh
            </Button>
          </Group>

          <form onSubmit={form.onSubmit(handleCreateReport)}>
            <Stack gap="md">
              <Group align="flex-end">
                <Select
                  label="Report Type"
                  placeholder="Select a report type"
                  data={[
                    { value: "spSearchTerm", label: "Sp Search Term" },
                    { value: "spAdvertisedProduct", label: "Sp Advertised Product" }
                  ]}
                  style={{ width: 300 }}
                  {...form.getInputProps('reportType')}
                />
                <DateInput
                  label="Start Date"
                  placeholder="Pick a date"
                  style={{ width: 150 }}
                  valueFormat="YYYY-MM-DD"
                  value={form.values.startDate}
                  onChange={(value) => form.setFieldValue('startDate', value)}
                />
                <DateInput
                  label="End Date"
                  placeholder="Pick a date"
                  style={{ width: 150 }}
                  valueFormat="YYYY-MM-DD"
                  value={form.values.endDate}
                  onChange={(value) => form.setFieldValue('endDate', value)}
                />
                <Button type="submit" loading={isLoading}>
                  Create Report
                </Button>
              </Group>
            </Stack>
          </form>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Start Date</Table.Th>
                <Table.Th>End Date</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reports.map((report) => (
                <Table.Tr key={report.id}>
                  <Table.Td>{report.reportType}</Table.Td>
                  <Table.Td>{report.startDate.split('T')[0]}</Table.Td>
                  <Table.Td>{report.endDate.split('T')[0]}</Table.Td>
                  <Table.Td>{new Date(report.createdAt).toLocaleString()}</Table.Td>
                  <Table.Td>{report.status}</Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleGetReport(report)}
                      loading={loadingReports[report.id]}
                    >
                      {report.status === 'COMPLETED' ? 'Download Report' : 'Check Status'}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    </Container>
  )
}

export default Ads 