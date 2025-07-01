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
import { getLocalData, setLocalData } from '@/utils/storage'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

function AdsSearchTerm() {
  const { run, isLoading } = useAsync()
  const [searchTerms, setSearchTerms] = useState([])
  const [pagination, setPagination] = useState({ totalPages: 1 })
  const [settings, setSettings] = useLocalStorage('adsSearchTermSettings', {
    startDate: formatDate(subDays(new Date(), 30)),
    endDate: formatDate(new Date()),
    page: 1,
    limit: 10,
    filter: {},
  })
  
  const { 
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  } = usePagination(settings.page, settings.limit)

  const form = useForm({
    initialValues: settings,
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
      ...form.values,
      limit,
      page,
    }))
    setSearchTerms(data)
    setPagination(pg)
  }

  useEffect(() => { 
    handleRefreshSearchTerms()  

    setSettings({
      ...form.values,
      page,
      limit,
    })
  }, [form.values, page, limit])
  
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
        page={page}
        limit={limit}
        totalPages={pagination.totalPages}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
      />
    </Stack>
  )
}

export default AdsSearchTerm