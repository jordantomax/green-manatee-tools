import { useEffect, useMemo } from "react"
import { Stack, Title, Group, Loader, Button } from "@mantine/core"
import { subDays, format } from 'date-fns'
import isEqual from 'lodash-es/isEqual'

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
import { RECORD_TYPES } from '@/utils/constants'
import { KeywordColumn, SearchTermColumn } from '@/components/amazon-ads/search-terms'


const formatDate = (date) => format(date, 'yyyy-MM-dd')

function SearchTerms() {
  const { handleRowClick } = useSearchTermsNavigation()

  const { 
    pagination,
    handlers: paginationHandlers
  } = usePagination('searchTerms-pagination')

  const {
    searchTerms,
    entities,
    negativeEntities,
    getSearchTermsData,
    lastCallParams,
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

  const refresh = async (view) => {
    const { pagination: { totalPages } } = await getSearchTermsData({
      dateRange,
      filters: view?.filters || filters,
      sorts: view?.sorts || sorts,
      ...pagination,
    })
    paginationHandlers.totalPagesChange(totalPages)
  }
  
  const [dateRange, setDateRange] = usePersistentState('searchTerms-dateRange', {
    startDate: formatDate(subDays(new Date(), 31)),
    endDate: formatDate(subDays(new Date(), 1)),
  })
  
  const {
    views,
    filters,
    sorts,
    activeViewId,
    viewHandlers,
    filterHandlers,
    sortHandlers,
    settings,
    settingsHandlers,
    newlyAddedFilterId,
    isLoading: viewsLoading
  } = useViews('searchTerms-views', RECORD_TYPES.SEARCH_TERMS, { onActiveViewChange: refresh })

  const hiddenColumns = settings?.hiddenColumns || []

  useEffect(() => { 
    refresh()
  }, [pagination.page, pagination.limit])
  
  const currentParams = useMemo(() => ({ dateRange, filters, sorts }), [dateRange, filters, sorts])
  
  const formIsDirty = useMemo(() => {
    return !isEqual(lastCallParams, currentParams)
  }, [lastCallParams, currentParams])
  
  return (
    <Stack>
      <Group justify="space-between" align="flex-start">
        <Group gap="sm">
          <Title order={2}>Search Terms</Title>
          {searchTermsLoading && <Loader size="sm" />}
        </Group>

        <Group gap="xs" align="flex-end">
          <AddFilter 
            columns={Object.keys(columnTypes)}
            handleFilterAdd={filterHandlers.add}
          />

          <AddSort
            columns={getSortableColumns()}
            handleSortAdd={sortHandlers.add}
          />

          <DateRangeInputPicker 
            value={dateRange}
            onChange={setDateRange}
          />

          <Button 
            variant="light" 
            type="submit" 
            disabled={!formIsDirty}
            children="Refresh"
            onClick={refresh}
          />
        </Group>
      </Group>

      <Stack>
        <ViewManager
          views={views}
          activeViewId={activeViewId}
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
          hiddenColumns,
          onColumnHide: settingsHandlers.hideColumn,
          handleRowClick,
        }), [searchTerms, columnComponents, hiddenColumns, settingsHandlers, handleRowClick])}
      />
      
      <TablePagination
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        handlePageChange={paginationHandlers.pageChange}
        handleLimitChange={paginationHandlers.limitChange}
      />
    </Stack>
  )
}

export default SearchTerms