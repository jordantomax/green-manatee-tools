import { useEffect, useState, useCallback } from "react"
import { Stack, Title, Group, Loader, Text } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'

import api from "@/utils/api"
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import RecordTable from "@/components/RecordTable"
import TablePagination from "@/components/TablePagination"
import { validators } from '@/utils/validation'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

function AdsSearchTerm() {
  const [searchTerms, setSearchTerms] = useState([])
  const [pagination, setPagination] = useState({ totalPages: 1 })
  const { run, isLoading } = useAsync()
  const { 
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination()

  const form = useForm({
    initialValues: {
      startDate: formatDate(subDays(new Date(), 30)),
      endDate: formatDate(new Date())
    },
    validate: {
      startDate: validators.required('Start date'),
      endDate: validators.required('End date'),
    },
    transformValues: (values) => ({
      startDate: formatDate(values.startDate),
      endDate: formatDate(values.endDate),
    })
  })
  
  const handleRefreshSearchTerms = async () => {
    const { data, pagination: pg } = await run(async () => await api.getAdsSearchTerms({
      limit: pageSize,
      page: currentPage,
      startDate: form.values.startDate,
      endDate: form.values.endDate
    }))
    setSearchTerms(data)
    setPagination(pg)
  }

  useEffect(() => { 
    handleRefreshSearchTerms()  
  }, [
    run, 
    form.values.startDate, 
    form.values.endDate, 
    pageSize,
    currentPage
  ])
  
  return (
    <Stack>
      <Group gap="sm">
        <Title order={2}>Search Terms</Title>
        {isLoading && <Loader size="sm" />}
      </Group>

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
        columnOrder={['keywordId', 'searchTerm']}
       />
      
      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={pagination.totalPages}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </Stack>
  )
}

export default AdsSearchTerm