import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconRefresh, IconDotsVertical, IconTrash, IconPlus } from '@tabler/icons-react'
import { Title, Button, Stack, Group, Table, Menu, Modal, Loader } from '@mantine/core'

import api from '@/api'
import useAsync from '@/hooks/useAsync'
import { useConfirm } from '@/hooks/useConfirm'
import classes from '@/styles/Ads.module.css'
import CreateReport from '@/components/amazon-ads/CreateReport'

function Reports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState({})
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { isLoading, run } = useAsync()
  const confirm = useConfirm()

  useEffect(() => {
    handleRefreshReports()
  }, [])

  const handleRefreshReports = async () => {
    const data = await run(async () => await api.getAdsReports())
    setReports(data)
  }

  const handleGetReport = useCallback(async (report) => {
    setLoadingReports(prev => ({ ...prev, [report.id]: true }))
    try {
      const updatedReport = await api.getAdsReport(report.id)
      setReports(prev => prev.map(r => r.id === report.id ? updatedReport : r))
    } finally {
      setLoadingReports(prev => ({ ...prev, [report.id]: false }))
    }
  }, [setReports, setLoadingReports])

  useEffect(() => {
    const hasPendingReports = reports.some(report => report.status === 'PENDING')

    if (!hasPendingReports) {
      return
    }

    const intervalId = setInterval(() => {
      reports.forEach(report => {
        if (report.status === 'PENDING' && !loadingReports[report.id]) {
          handleGetReport(report)
        }
      })
    }, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [reports, loadingReports, handleGetReport])

  const handleGetTaggedReport = async (report) => {
    await run(async () => await api.getTaggedAdsReport(report.id))
  }

  const handleDeleteReport = async (report) => {
    const confirmed = await confirm({
      title: 'Deleting a report cannot be undone.',
      confirmText: 'Delete',
      confirmColor: 'red'
    })
    if (confirmed) {
      await run(async () => await api.deleteAdsReport(report.id))
      await handleRefreshReports()
    }
  }

  const handleRowClick = (report, event) => {
    if (event.target.closest('button, a, [role="menuitem"], input, select, textarea')) {
      return;
    }

    if (report.status === 'COMPLETED') {
              navigate(`/ads/reports/${report.id}`);
    } else {
      if (!loadingReports[report.id]) {
        handleGetReport(report);
      }
    }
  };
  
  return(
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={1}>Reports</Title>
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
            <Table.Th>Source</Table.Th>
            <Table.Th>Time Unit</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {reports.map((report) => (
            <Table.Tr
              key={report.id}
              onClick={(e) => handleRowClick(report, e)}
              className={classes.tableRowHover}
            >
              <Table.Td>{report.reportType}</Table.Td>
              <Table.Td>{report.source || '-'}</Table.Td>
              <Table.Td>{report.configuration?.timeUnit || '-'}</Table.Td>
              <Table.Td>{report.startDate.split('T')[0]}</Table.Td>
              <Table.Td>{report.endDate.split('T')[0]}</Table.Td>
              <Table.Td>{new Date(report.createdAt).toLocaleString()}</Table.Td>
              <Table.Td>
                {loadingReports[report.id] && report.status !== 'COMPLETED' ? (
                  <Loader size="xs" />
                ) : (
                  report.status
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {report.status === 'COMPLETED' && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetTaggedReport(report);
                      }}
                    >
                      Tag
                    </Button>
                  )}
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <Button 
                        size="xs" 
                        variant="subtle" 
                        p={0} 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDotsVertical size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report);
                        }}
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
  )
}

export default Reports