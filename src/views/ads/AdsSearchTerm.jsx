import { useEffect, useState, useCallback } from "react"
import { Stack, Title, Group } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'

import api from "@/utils/api"
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import RecordTable from "@/components/RecordTable"
import { validators } from '@/utils/validation'

function AdsSearchTerm() {
  const [searchTerms, setSearchTerms] = useState([])
  const { run, isLoading } = useAsync()
  const { 
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange 
  } = usePagination()

  const form = useForm({
    initialValues: {
      startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    },
    validate: {
      startDate: validators.required('Start date'),
      endDate: validators.required('End date'),
    },
    transformValues: (values) => ({
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
    })
  })
  
  const handleRefreshSearchTerms = useCallback(async () => {
    const data = await run(async () => await api.getAdsSearchTerms({
        startDate: form.values.startDate,
        endDate: form.values.endDate
    }))
    setSearchTerms(data)
  }, [run])

  useEffect(() => { 
    handleRefreshSearchTerms()  
  }, [handleRefreshSearchTerms])
  
  return (
    <Stack>
      <Title order={1}>Search Terms</Title>

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

      <RecordTable
        data={searchTerms}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Stack>
  )
}

export default AdsSearchTerm