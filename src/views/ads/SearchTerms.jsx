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

  const [dateRange, setDateRange] = usePersistentState('searchTerms-dateRange', {
    startDate: formatDate(subDays(new Date(), 31)),
    endDate: formatDate(subDays(new Date(), 1)),
  })
  
  const [filters, setFilters] = usePersistentState('searchTerms-filters', [])
  const [sorts, setSorts] = usePersistentState('searchTerms-sorts', [])
  
  const { 
    pagination,
    handlers: paginationHandlers
  } = usePagination('searchTerms-pagination')

  const form = useForm({
    initialValues: { 
      dateRange,
      filters,
      sorts,
      ...pagination
    },
    validate: {
      'dateRange.startDate': validators.required('Start date'),
      'dateRange.endDate': validators.required('End date'),
    },
    transformValues: ({ dateRange, filters, sorts, ...values }) => {
      return {
        ...values,
        dateRange,
        filter: Filter.toAPI(filters),
        sort: Sort.toAPI(sorts)
      }
    },
  })

  const filterHandlers = useFilterHandlers(
    filters, setFilters
  )
  const sortHandlers = useSortHandlers(
    sorts, setSorts
  )
  const { views, handlers: viewHandlers } = useViews(
    RECORD_TYPES.SEARCH_TERMS,
    filters,
    sorts
  )
  
  const handleSubmit = async ({ dateRange, ...transformedValues }) => {
    const { pagination: newPagination } = await getSearchTermsData({
      ...transformedValues,
      dateRange,
      ...pagination,
    })
    // Note: We can't update pagination here since it's managed by usePagination hook
    // The pagination will be updated by the API response handling
    form.resetDirty()
  }

  useEffect(() => { 
    form.onSubmit(handleSubmit)()
  }, [pagination])
  
  // Sync form values when separate state changes
  useEffect(() => {
    form.setValues({
      dateRange,
      filters,
      sorts,
      ...pagination
    })
  }, [dateRange, filters, sorts, pagination])

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
              value={dateRange}
              onChange={setDateRange}
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
            currentFilters={filters}
            currentSorts={sorts}
            onViewLoad={(view) => {
              // TODO: Parse and load view filters/sorts
            }}
            handlers={viewHandlers}
          />
          
          <ActiveFilters 
            filters={filters} 
            handleFilterRemove={filterHandlers.remove}
            handleFilterChange={filterHandlers.update}
          />

          <ActiveSorts
            sorts={sorts}
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
          page={pagination.page}
          limit={pagination.limit}
          totalPages={pagination.totalPages}
          handlePageChange={paginationHandlers.pageChange}
          handleLimitChange={paginationHandlers.limitChange}
        />
      </Stack>
    </form>
  )
}

export default SearchTerms