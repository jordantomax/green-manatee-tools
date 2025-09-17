import { useEffect, useMemo } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'

import { validators } from '@/utils/validation'
import usePagination from '@/hooks/usePagination'
import usePersistentState from '@/hooks/usePersistentState'
import useFilterHandlers from '@/hooks/useFilterHandlers'
import useSortHandlers from '@/hooks/useSortHandlers'
import useViews from '@/hooks/useViews'
import useSearchTermsData from '@/hooks/useSearchTermsData'
import useSearchTermsNavigation from '@/hooks/useSearchTermsNavigation'
import RecordTable from "@/components/RecordTable"
import TablePagination from "@/components/TablePagination"
import { AddFilter, ActiveFilters } from "@/components/TableFilter"
import { AddSort, ActiveSorts } from "@/components/TableSort"
import DateRangeInputPicker from "@/components/DateRangeInputPicker"
import ViewManager from "@/components/ViewManager"
import { columnTypes, getSortableColumns } from '@/utils/table'
import { Filter, Sort } from '@/utils/filter-sort'
import { SEARCH_TERMS_HIDDEN_COLUMNS, RECORD_TYPES } from '@/utils/constants'
import { KeywordColumn, SearchTermColumn } from '@/components/amazon-ads/search-terms'


const formatDate = (date) => format(date, 'yyyy-MM-dd')

function SearchTerms() {
  const { handleRowClick } = useSearchTermsNavigation()

  const {
    searchTerms,
    entities,
    negativeEntities,
    getSearchTermsData,
    isLoading: searchTermsLoading
  } = useSearchTermsData()
  
  const columnComponents = useMemo(() => ({
    keyword: (row) => (
      <KeywordColumn 
        row={row}
        state={entities.keywords[row.keywordId]?.state || entities.targets[row.keywordId]?.state}
      />
    ),
    searchTerm: (row) => (
      <SearchTermColumn 
        row={row}
        negativeKeywords={negativeEntities.keywords}
        negativeTargets={negativeEntities.targets}
      />
    )
  }), [entities, negativeEntities])

  const [
    settings, 
    setSettings
  ] = usePersistentState('adsSearchTermSettings', {
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
    form.values.filters, (newFilters) => form.setFieldValue('filters', newFilters)
  )
  const sortHandlers = useSortHandlers(
    form.values.sorts, (newSorts) => form.setFieldValue('sorts', newSorts)
  )
  const { views, handlers: viewHandlers } = useViews(
    RECORD_TYPES.SEARCH_TERMS,
    form.values.filters,
    form.values.sorts
  )
  
  const handleSubmit = async ({ dateRange, ...transformedValues }) => {
    const { pagination } = await getSearchTermsData({
      ...transformedValues,
      dateRange,
      limit,
      page,
    })
    setSettings({
      ...form.values,
      ...pagination,
    })
    form.resetDirty()
  }

  useEffect(() => { 
    form.onSubmit(handleSubmit)()
  }, [page, limit])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Title order={2}>Search Terms</Title>
            {searchTermsLoading && <Loader size="sm" />}
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
            views={views}
            resourceType={RECORD_TYPES.SEARCH_TERMS}
            currentFilters={form.values.filters}
            currentSorts={form.values.sorts}
            onViewLoad={(view) => {
              // TODO: Parse and load view filters/sorts
            }}
            handlers={viewHandlers}
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