import React, { useState, useEffect } from 'react'
import { Container, Title, Paper, Button, Stack, Group, Text, Table, Menu, Modal } from '@mantine/core'
import { IconRefresh, IconDotsVertical, IconTrash, IconPlus } from '@tabler/icons-react'
import api from '@/utils/api'
import CreateReport from '@/components/amazon/CreateReport'

function Ads() {
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState({})
  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    handleRefreshReports()
  }, [])

  const handleRefreshReports = async () => {
    setIsLoading(true)
    const data = await api.getAdsReports()
    setReports(data)
    setIsLoading(false)
  }

  const handleGetReport = async (report) => {
    setLoadingReports(prev => ({ ...prev, [report.id]: true }))
    try {
      const updatedReport = await api.getAdsReport(report.id)
      setReports(prev => prev.map(r => r.id === report.id ? updatedReport : r))
      console.log('Updated report:', updatedReport)
    } finally {
      setLoadingReports(prev => ({ ...prev, [report.id]: false }))
    }
  }
  
  const handleGetTaggedReport = async (report) => {
    const tagged = await api.getTaggedAdsReport(report.id)
    console.log('Tagged:', tagged.result)
  }

  const handleDeleteReport = async (report) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setIsLoading(true)
      try {
        await api.deleteAdsReport(report.id)
        await handleRefreshReports()
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={2}>Ads Reports</Title>
            <Group>
              <Button
                variant="light"
                onClick={() => setCreateModalOpen(true)}
                leftSection={<IconPlus size={16} />}
              >
                Create Report
              </Button>
              <Button
                variant="light"
                onClick={handleRefreshReports}
                loading={isLoading}
                leftSection={<IconRefresh size={16} />}
              >
                Refresh
              </Button>
            </Group>
          </Group>

          <Modal
            opened={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            title="Create Report"
            size="sm"
          >
            <CreateReport setCreateModalOpen={setCreateModalOpen} handleRefreshReports={handleRefreshReports} />
          </Modal>

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
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleGetReport(report)}
                        loading={loadingReports[report.id]}
                      >
                        {report.status === 'COMPLETED' ? 'Download Report' : 'Check Status'}
                      </Button>
                      {report.status === 'COMPLETED' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleGetTaggedReport(report)}
                        >
                          Add Tags
                        </Button>
                      )}
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <Button size="xs" variant="subtle" p={0}>
                            <IconDotsVertical size={16} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDeleteReport(report)}
                          >
                            Delete Report
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
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