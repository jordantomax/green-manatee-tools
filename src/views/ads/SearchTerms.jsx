import { useState, useEffect, useMemo, useCallback } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
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
import DateRangeInputPicker from "@/components/DateRangeInputPicker"
import { columnTypes, createDefaultSort, createDefaultFilter, getSortableColumns } from '@/utils/table'
import { SEARCH_TERMS_HIDDEN_COLUMNS } from '@/utils/constants'


const formatDate = (date) => format(date, 'yyyy-MM-dd')

function SearchTerms() {
  const navigate = useNavigate()
  const { run, isLoading } = useAsync()
  const [searchTerms, setSearchTerms] = useState([])
  const [keywords, setKeywords] = useState({})
  const [targets, setTargets] = useState({})
  const [negativeKeywords, setNegativeKeywords] = useState([])
  const [negativeTargets, setNegativeTargets] = useState([])

  const [settings, setSettings] = useLocalStorage('adsSearchTermSettings', {
    dateRange: {
      startDate: formatDate(subDays(new Date(), 31)),
      endDate: formatDate(subDays(new Date(), 1)),
    },
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
    initialValues: settings,
    validate: {
      'dateRange.startDate': validators.required('Start date'),
      'dateRange.endDate': validators.required('End date'),
    },
    transformValues: ({ filters, sorts, dateRange, ...values }) => {
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
        dateRange,
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
      run(() => api.listKeywords({ filters: { keywordIds: data.map(d => d.keywordId) } })),
      run(() => api.listTargets({ filters: { targetIds: data.map(d => d.keywordId) } }))
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
  
  const getNegatives = async (data) => {
    const [negativeKeywords, negativeTargets] = await Promise.all([
      api.listNegativeKeywords({ filters: { adGroupIds: data.map(d => d.adGroupId) } }),
      api.listNegativeTargets({ filters: { adGroupIds: data.map(d => d.adGroupId) } })
    ])
    setNegativeKeywords(negativeKeywords)
    setNegativeTargets(negativeTargets)
    console.log(negativeKeywords, negativeTargets)
  }

  const handleSubmit = async ({ dateRange, ...transformedValues }) => {
    const { startDate, endDate } = dateRange
    const { data, pagination } = await run(async () => await api.getAdsSearchTerms({
      ...transformedValues,
      startDate,
      endDate,
      limit,
      page,
    }))
    setSettings({
      ...form.values,
      ...pagination,
    })
    setSearchTerms(data)
    getState(data)
    getNegatives(data)
    
    form.resetDirty()
  }

  useEffect(() => { 
    form.onSubmit(handleSubmit)()
  }, [page, limit])

  const handleFilterAdd = (column) => {
    const filter = createDefaultFilter(column)
    form.setFieldValue('filters', [...settings.filters, filter])
  }

  const handleFilterRemove = (filterId) => {
    const filters = form.values.filters.filter(f => f.id !== filterId)
    form.setFieldValue('filters', filters)
  }

  const handleFilterChange = (filterId, condition, value) => {
    const filters = form.values.filters.map(f => f.id === filterId ? { ...f, condition, value } : f)
    form.setFieldValue('filters', filters)
  }

  const handleSortAdd = (column) => {
    const newSort = createDefaultSort(column)
    const currentSorts = form.values.sorts || []
    form.setFieldValue('sorts', [...currentSorts, newSort])
  }

  const handleSortRemove = (sortId) => {
    const sorts = form.values.sorts.filter(s => s.id !== sortId)
    form.setFieldValue('sorts', sorts)
  }

  const handleSortChange = (sortId, column, direction) => {
    const sorts = form.values.sorts.map(s => 
      s.id === sortId ? { ...s, column, direction } : s
    )
    form.setFieldValue('sorts', sorts)
  }
  
  const handleRowClick = useCallback((row) => {
    const param = row.matchType === 'TARGETING_EXPRESSION' ? 'targetId' : 'keywordId'
    navigate(`/ads/search-terms/${encodeURIComponent(row.searchTerm)}?${param}=${row.keywordId}`)
  }, [navigate])

  const enrichedSearchTerms = useMemo(() => 
    searchTerms.map(term => ({
      _state: keywords[term.keywordId]?.state || targets[term.keywordId]?.state,
      ...term
    })), [searchTerms, keywords, targets]
  )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group gap="sm">
          <Title order={2}>Search Terms</Title>
          {isLoading && <Loader size="sm" />}
        </Group>

        <Group gap="xs" align="flex-end">
          <DateRangeInputPicker 
            value={form.values.dateRange}
            onChange={(dateRange) => form.setFieldValue('dateRange', dateRange)}
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
          filters={form.values.filters} 
          handleFilterRemove={handleFilterRemove}
          handleFilterChange={handleFilterChange}
        />

        <ActiveSorts
          sorts={form.values.sorts}
          handleSortRemove={handleSortRemove}
          handleSortChange={handleSortChange}
        />

        <RecordTable 
          {...useMemo(() => ({
            data: enrichedSearchTerms,
            columnOrder: ['keyword', 'searchTerm', 'matchType', 'acosClicks7d'],
            hiddenColumns: SEARCH_TERMS_HIDDEN_COLUMNS,
            handleRowClick,
            stateProp: '_state'
          }), [enrichedSearchTerms, handleRowClick])} 
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