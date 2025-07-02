import { useState, useEffect } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
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
import { columnTypes } from '@/utils/table'

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

  const handleSubmit = async (transformedValues) => {
    const { data, pagination: pg } = await run(async () => await api.getAdsSearchTerms({
      ...transformedValues,
      limit,
      page,
    }))
    setSettings({
      ...form.getValues(),
      page,
      limit,
    })
    setSearchTerms(data)
    setPagination(pg)
  }
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: settings,
    validate: {
      startDate: validators.required('Start date'),
      endDate: validators.required('End date'),
    },
    transformValues: (values) => ({
      ...values
    }),
    onValuesChange: (values) => {
      setSettings({ ...settings, ...values })
    },
  })

  const handleFilterAdd = (filter) => {
    form.setValues( { filters: [...settings.filters, filter] } )
  }

  useEffect(() => { 
    form.onSubmit(handleSubmit)()
  }, [])
  
  const handleFilterRemove = (filter) => {
    const filters = form.getValues().filters.filter(f => f.id !== filter.id)
    form.setFieldValue('filters', filters)
  }

  const handleFilterChange = (filter, condition, value) => {
    const filters = form.getValues().filters.map(f => f.id === filter.id ? { ...f, condition, value } : f)
    form.setFieldValue('filters', filters)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group gap="sm">
          <Title order={2}>Search Terms</Title>
          {isLoading && <Loader size="sm" />}
        </Group>

        <Group align="flex-end">
          <DateInput
            {...form.getInputProps('startDate')}
            label="Start Date"
            placeholder="Pick a date"
            style={{ maxWidth: 150 }}
            valueFormat="YYYY-MM-DD"
          />

          <DateInput
            {...form.getInputProps('endDate')}
            label="End Date"
            placeholder="Pick a date"
            style={{ maxWidth: 150 }}
            valueFormat="YYYY-MM-DD"
          />

          <AddFilter 
            columns={Object.keys(columnTypes)}
            handleFilterAdd={handleFilterAdd}
          />

          <Button 
            variant="light" 
            type="submit" 
            disabled={!form.isDirty()}
            children="Refresh"
          />
        </Group>

        <ActiveFilters 
          filters={form.getValues().filters} 
          handleFilterRemove={handleFilterRemove}
          handleFilterChange={handleFilterChange}
        />

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
    </form>
  )
}

export default AdsSearchTerm