import { useEffect, useState } from "react"
import { Stack, Title, Group, Loader } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'

import api from "@/utils/api"
import { validators } from '@/utils/validation'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import RecordTable from "@/components/RecordTable"
import TablePagination from "@/components/TablePagination"
import { AddFilter, ActiveFilters } from "@/components/TableFilter"

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
    filters: [],
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

  const handleAddFilter = (filter) => {
    form.setFieldValue('filters', [
      ...form.values.filters,
      filter
    ])
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
          style={{ maxWidth: 150 }}
          valueFormat="YYYY-MM-DD"
          value={form.values.startDate}
          onChange={(value) => form.setFieldValue('startDate', value)}
        />

        <DateInput
          label="End Date"
          placeholder="Pick a date"
          style={{ maxWidth: 150 }}
          valueFormat="YYYY-MM-DD"
          value={form.values.endDate}
          onChange={(value) => form.setFieldValue('endDate', value)}
        />

        <AddFilter 
          columns={Object.keys(searchTerms[0] || {})}
          handleAddFilter={handleAddFilter}
        />
      </Group>

      <ActiveFilters filters={form.values.filters} />

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