import { useState, useEffect } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

import api from "@/api"
import { validators } from '@/utils/validation'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import RecordTable from "@/components/RecordTable"
import TablePagination from "@/components/TablePagination"
import { AddFilter, ActiveFilters } from "@/components/TableFilter"
import { AddSort, ActiveSorts } from "@/components/TableSort"
import { columnTypes, createDefaultSort, createDefaultFilter, getSortableColumns } from '@/utils/table'
import { SEARCH_TERMS_HIDDEN_COLUMNS } from '@/utils/constants'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

function SearchTerms() {
  const navigate = useNavigate()
  const { run, isLoading } = useAsync()
  const [searchTerms, setSearchTerms] = useState([])
  const [keywords, setKeywords] = useState({})
  const [targets, setTargets] = useState({})
  const [settings, setSettings] = useLocalStorage('adsSearchTermSettings', {
    startDate: formatDate(subDays(new Date(), 30)),
    endDate: formatDate(new Date()),
    page: 1,
    limit: 10,
    totalPages: 1,
    filters: [],
    sorts: [],
  })
  
  const { 
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  } = usePagination(settings.page, settings.limit)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: settings,
    validate: {
      startDate: validators.required('Start date'),
      endDate: validators.required('End date'),
    },
    transformValues: ({ filters, sorts, ...values }) => {
      const filter = filters?.length > 0 ? {
        and: filters.map(f => ({
          [f.column]: {
            [f.condition]: f.value
          }
        }))
      } : null
      
      const sort = sorts?.length > 0 ? sorts.map(s => (
        { [s.column]: s.direction }
      )) : null
      
      return {
        ...values,
        filter,
        sort
      }
    },
    onValuesChange: (values) => {
      setSettings({ ...settings, ...values })
    },
  })
  
  const getState = async (data) => {
    const [keywordsData, targetsData] = await Promise.all([
      run(() => api.listKeywords({ keywordIds: data.map(d => d.keywordId) })),
      run(() => api.listTargets({ targetIds: data.map(d => d.keywordId) }))
    ])
    
    const keywordsMap = keywordsData?.reduce(
      (map, keyword) => ({ ...map, [keyword.keywordId]: keyword }), {}
    ) || {}

    const targetsMap = targetsData?.reduce(
      (map, target) => ({ ...map, [target.targetId]: target }), {}
    ) || {}

    setKeywords(keywordsMap)
    setTargets(targetsMap)
  }

  const handleSubmit = async (transformedValues) => {
    const { data, pagination } = await run(async () => await api.getAdsSearchTerms({
      ...transformedValues,
      limit,
      page,
    }))
    setSettings({
      ...form.getValues(),
      ...pagination,
    })
    setSearchTerms(data)
    getState(data)
    
    form.resetDirty()
  }

  useEffect(() => { 
    form.onSubmit(handleSubmit)()
  }, [page, limit])

  const handleFilterAdd = (column) => {
    const filter = createDefaultFilter(column)
    form.setValues( { filters: [...settings.filters, filter] } )
  }

  const handleFilterRemove = (filterId) => {
    const filters = form.getValues().filters.filter(f => f.id !== filterId)
    form.setFieldValue('filters', filters)
  }

  const handleFilterChange = (filterId, condition, value) => {
    const filters = form.getValues().filters.map(f => f.id === filterId ? { ...f, condition, value } : f)
    form.setFieldValue('filters', filters)
  }

  const handleSortAdd = (column) => {
    const newSort = createDefaultSort(column)
    const currentSorts = form.getValues().sorts || []
    form.setFieldValue('sorts', [...currentSorts, newSort])
  }

  const handleSortRemove = (sortId) => {
    const sorts = form.getValues().sorts.filter(s => s.id !== sortId)
    form.setFieldValue('sorts', sorts)
  }

  const handleSortChange = (sortId, column, direction) => {
    const sorts = form.getValues().sorts.map(s => 
      s.id === sortId ? { ...s, column, direction } : s
    )
    form.setFieldValue('sorts', sorts)
  }
  
  const handleRowClick = (row) => {
    const param = row.matchType === 'TARGETING_EXPRESSION' ? 'targetId' : 'keywordId'
    navigate(`/ads/search-terms/${encodeURIComponent(row.searchTerm)}?${param}=${row.keywordId}`)
  }
  
  const enrichedSearchTerms = searchTerms.map(term => ({
    _state: keywords[term.keywordId]?.state || targets[term.keywordId]?.state,
    ...term
  }))

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group gap="sm">
          <Title order={2}>Search Terms</Title>
          {isLoading && <Loader size="sm" />}
        </Group>

        <Group gap="xs" align="flex-end">
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

          <AddSort
            columns={getSortableColumns()}
            handleSortAdd={handleSortAdd}
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

        <ActiveSorts
          sorts={form.getValues().sorts}
          handleSortRemove={handleSortRemove}
          handleSortChange={handleSortChange}
        />

        <RecordTable 
          data={enrichedSearchTerms} 
          columnOrder={['keyword', 'searchTerm', 'matchType', 'acosClicks7d']}
          hiddenColumns={SEARCH_TERMS_HIDDEN_COLUMNS}
          handleRowClick={handleRowClick}
          stateProp="_state"
         />
        
        <TablePagination
          page={page}
          limit={limit}
          totalPages={settings.totalPages}
          handlePageChange={handlePageChange}
          handleLimitChange={handleLimitChange}
        />
      </Stack>
    </form>
  )
}

export default SearchTerms