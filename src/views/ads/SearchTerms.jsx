import { useEffect, useMemo } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
import { useForm } from '@mantine/form'
import { subDays, format } from 'date-fns'

import { validators } from '@/utils/validation'
import usePagination from '@/hooks/usePagination'
import usePersistentState from '@/hooks/usePersistentState'
import useViews from '@/hooks/useViews'
import useSearchTermsData from '@/hooks/useSearchTermsData'
import useSearchTermsNavigation from '@/hooks/useSearchTermsNavigation'
import RecordTable from "@/components/RecordTable"
import TablePagination from "@/components/TablePagination"
import AddFilter from "@/components/AddFilter"
import ActiveFilters from "@/components/ActiveFilters"
import AddSort from "@/components/AddSort"
import ActiveSorts from "@/components/ActiveSorts"
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
  
  const { 
    pagination,
    handlers: paginationHandlers
  } = usePagination('searchTerms-pagination')

  const {
    views,
    filters,
    sorts,
    activeViewId,
    viewHandlers,
    filterHandlers,
    sortHandlers,
    newlyAddedFilterId,
    isLoading: viewsLoading
  } = useViews(
    'searchTerms-views',
    RECORD_TYPES.SEARCH_TERMS,
  )

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

  const handleSubmit = async ({ dateRange, ...transformedValues }) => {
    await getSearchTermsData({
      dateRange,
      ...transformedValues,
      ...pagination,
    })
    form.resetDirty()
  }

  useEffect(() => { 
    form.onSubmit(handleSubmit)()
  }, [pagination])
  
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
            activeViewId={activeViewId}
            filters={filters}
            sorts={sorts}
            onViewLoad={(view) => {
              // TODO: Parse and load view filters/sorts
            }}
            viewHandlers={viewHandlers}
            isLoading={viewsLoading}
          />
          
          <ActiveFilters 
            filters={filters} 
            handleFilterRemove={filterHandlers.remove}
            handleFilterChange={filterHandlers.update}
            newlyAddedFilterId={newlyAddedFilterId}
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