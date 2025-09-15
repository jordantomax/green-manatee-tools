import { useState, useEffect, useMemo, useCallback } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

import api from "@/api"
import { validators } from '@/utils/validation'
import useAsync from '@/hooks/useAsync'
import usePagination from '@/hooks/usePagination'
import useLocalStorage from '@/hooks/useLocalStorage'
import useFilterHandlers from '@/hooks/useFilterHandlers'
import useSortHandlers from '@/hooks/useSortHandlers'
import RecordTable from "@/components/RecordTable"
import TablePagination from "@/components/TablePagination"
import { AddFilter, ActiveFilters } from "@/components/TableFilter"
import { AddSort, ActiveSorts } from "@/components/TableSort"
import DateRangeInputPicker from "@/components/DateRangeInputPicker"
import ViewManager from "@/components/ViewManager"
import { columnTypes, getSortableColumns } from '@/utils/table'
import { Filter, Sort } from '@/utils/filter-sort'
import { SEARCH_TERMS_HIDDEN_COLUMNS, RECORD_TYPES } from '@/utils/constants'
import { getEntityType } from '@/utils/amazon-ads'
import { KeywordColumn, SearchTermColumn } from '@/components/amazon-ads/search-terms'


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
      return {
        ...values,
        dateRange,
        filter: Filter.toAPI(filters),
        sort: Sort.toAPI(sorts)
      }
    },
    onValuesChange: (values) => {
      setSettings({ ...settings, ...values })
    },
  })

  const filterHandlers = useFilterHandlers(
    form.values.filters, 
    (newFilters) => form.setFieldValue('filters', newFilters)
  )
  const sortHandlers = useSortHandlers(
    form.values.sorts,
    (newSorts) => form.setFieldValue('sorts', newSorts)
  )
  
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
    const keywordTexts = data.filter(d => getEntityType(d.matchType) === 'keyword').map(d => d.searchTerm)
    const asins = data.filter(d => getEntityType(d.matchType) === 'target').map(d => d.searchTerm)

    const [negativeKeywords, negativeTargets] = await Promise.all([
      api.listNegativeKeywords({ filters: { keywordTexts } }),
      api.listNegativeTargets({ filters: { asins } })
    ])
    setNegativeKeywords(negativeKeywords)
    setNegativeTargets(negativeTargets)
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

  
  const handleRowClick = useCallback((row) => {
    const entityType = getEntityType(row.matchType)
    const entityId = row.keywordId
    const paramMap = { target: 'targetId', keyword: 'keywordId' }
    const param = paramMap[entityType]
    navigate(`/ads/search-terms/${encodeURIComponent(row.searchTerm)}?${param}=${entityId}`)
  }, [navigate])

  const columnComponents = useMemo(() => ({
    keyword: (row) => (
      <KeywordColumn 
        row={row}
        state={keywords[row.keywordId]?.state || targets[row.keywordId]?.state}
      />
    ),
    searchTerm: (row) => (
      <SearchTermColumn 
        row={row}
        negativeKeywords={negativeKeywords}
        negativeTargets={negativeTargets}
      />
    )
  }), [keywords, targets, negativeKeywords, negativeTargets])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group justify="space-between" align="flex-start">
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
              handleFilterAdd={filterHandlers.add}
            />

            <AddSort
              columns={getSortableColumns()}
              handleSortAdd={sortHandlers.add}
            />

            <Button 
              variant="light" 
              type="submit" 
              disabled={!form.isDirty()}
              children="Refresh"
            />
          </Group>
        </Group>

        <Stack>
          <ViewManager
            resourceType={RECORD_TYPES.SEARCH_TERMS}
            currentFilters={form.values.filters}
            currentSorts={form.values.sorts}
            onViewLoad={(view) => {
              // TODO: Parse and load view filters/sorts
            }}
          />
          
          <ActiveFilters 
            filters={form.values.filters} 
            handleFilterRemove={filterHandlers.remove}
            handleFilterChange={filterHandlers.update}
          />

          <ActiveSorts
            sorts={form.values.sorts}
            handleSortRemove={sortHandlers.remove}
            handleSortChange={sortHandlers.update}
          />
        </Stack>

        <RecordTable 
          {...useMemo(() => ({
            data: searchTerms,
            columnComponents,
            columnOrder: ['keyword', 'searchTerm', 'matchType', 'acosClicks7d'],
            hiddenColumns: SEARCH_TERMS_HIDDEN_COLUMNS,
            handleRowClick,
          }), [searchTerms, columnComponents, handleRowClick])}
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