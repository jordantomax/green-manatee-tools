import React, { useState } from 'react'
import { Select, Button, Group, Stack, Box } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import api from '@/utils/api'
import { useAsync } from '@/hooks/useAsync'

const CreateReport = ({ setCreateModalOpen, handleRefreshReports }) => {
  const { isLoading, run } = useAsync()
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
      endDate: yesterdayStr,
      timeUnit: 'SUMMARY'
    },
    validate: {
      reportType: (value) => (!value ? 'Report type is required' : null),
      startDate: (value) => (!value ? 'Start date is required' : null),
      endDate: (value) => (!value ? 'End date is required' : null),
      timeUnit: (value) => (!value ? 'Time unit is required' : null)
    }
  })

  const handleCreateReport = async (values) => {
    await run(async () => {
    await api.createAdsReport(values)
    await handleRefreshReports()
    setCreateModalOpen(false)
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleCreateReport)}>
      <Stack gap="md">
        <Group>
          <Select
            label="Report Type"
            placeholder="Select a report type"
            data={[
              { value: "spSearchTerm", label: "SP Search Term" },
              { value: "spAdvertisedProduct", label: "SP Advertised Product" },
              { value: "spTargeting", label: "SP Targeting" }
            ]}
            style={{ width: '100%' }}
            {...form.getInputProps('reportType')}
          />
          <Select
            label="Time Unit"
            placeholder="Select time unit"
            data={[
              { value: "SUMMARY", label: "Summary" },
              { value: "DAILY", label: "Daily" }
            ]}
            style={{ width: '100%' }}
            {...form.getInputProps('timeUnit')}
          />
          <Group align="flex-end" grow>
            <DateInput
              label="Start Date"
              placeholder="Pick a date"
              style={{ width: '50%' }}
              valueFormat="YYYY-MM-DD"
              value={form.values.startDate}
              onChange={(value) => form.setFieldValue('startDate', value)}
            />
            <DateInput
              label="End Date"
              placeholder="Pick a date"
              style={{ width: '50%' }}
              valueFormat="YYYY-MM-DD"
              value={form.values.endDate}
              onChange={(value) => form.setFieldValue('endDate', value)}
            />
          </Group>

          <Button w="100%" mt="lg" type="submit" loading={isLoading}>
            Create Report
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default CreateReport 