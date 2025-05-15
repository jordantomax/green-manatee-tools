import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { 
  Table, 
  Text, 
  Paper, 
  Group, 
  Stack, 
  Select, 
  TextInput, 
  NumberInput,
  ActionIcon,
  Menu,
  Checkbox,
  Button,
  Pagination
} from '@mantine/core'
import { IconSortAscending, IconSortDescending, IconX, IconPlus, IconColumns, IconEye } from '@tabler/icons-react'
import SearchableSelect from './SearchableSelect'
import { getLocalData, setLocalData } from '@/utils/storage'
import classes from '@/styles/DataTable.module.css'
import startCase from 'lodash-es/startCase'

function DataTable({
  data,
  title,
  columnFormats = {},
  tableId,
  currencyColumns = [],
  paginationFromQueryParams = false,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  onPageChange,
  onPageSizeChange,
  columnOrder = []
}) {
  const localStorageKey = useMemo(() => {
    if (!tableId) return null
    return `dataTableState-${tableId}`
  }, [tableId])

  const [filters, setFilters] = useState([])
  const [activeFilters, setActiveFilters] = useState({})
  const [activeSorts, setActiveSorts] = useState({})
  const [visibleColumns, setVisibleColumns] = useState(new Set())
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(100)

  // Compute columns, prioritizing columnOrder, then sorting the rest
  const columns = useMemo(() => {
    if (!data || data.length === 0) return []
    const allCols = Object.keys(data[0] || {})
    if (!columnOrder || columnOrder.length === 0) return allCols.sort()
    const rest = allCols.filter(col => !columnOrder.includes(col)).sort()
    return [...columnOrder, ...rest]
  }, [data, columnOrder])

  useEffect(() => {
    if (!localStorageKey) {
      if (columns.length > 0) setVisibleColumns(new Set(columns))
      setIsStateLoaded(true)
      return
    }
    let stateAppliedFromStorage = false
    const savedState = getLocalData(localStorageKey)
    if (savedState) {
      if (savedState.savedFilters && Array.isArray(savedState.savedFilters)) {
        setFilters(savedState.savedFilters)
        const newActiveFilters = {}
        savedState.savedFilters.forEach(filter => {
          if (filter.operator && filter.value) {
            newActiveFilters[filter.column] = filter
          }
        })
        setActiveFilters(newActiveFilters)
      }
      if (savedState.savedActiveSorts) setActiveSorts(savedState.savedActiveSorts)
      if (savedState.savedVisibleColumns && Array.isArray(savedState.savedVisibleColumns)) {
        setVisibleColumns(new Set(savedState.savedVisibleColumns))
      } else if (columns.length > 0) {
        setVisibleColumns(new Set(columns))
      }
      if (!paginationFromQueryParams) {
        if (typeof savedState.savedCurrentPage === 'number') setInternalCurrentPage(savedState.savedCurrentPage)
        if (typeof savedState.savedPageSize === 'number') setInternalPageSize(savedState.savedPageSize)
      }
      stateAppliedFromStorage = true
    }
    if (!stateAppliedFromStorage && columns.length > 0) {
      setVisibleColumns(new Set(columns))
    }
    setIsStateLoaded(true)
  }, [localStorageKey, columns, paginationFromQueryParams])

  useEffect(() => {
    if (!localStorageKey || !isStateLoaded) return
    const stateToSave = {
      savedFilters: filters,
      savedActiveSorts: activeSorts,
      savedVisibleColumns: Array.from(visibleColumns),
    }
    if (!paginationFromQueryParams) {
      stateToSave.savedCurrentPage = internalCurrentPage
      stateToSave.savedPageSize = internalPageSize
    }
    setLocalData(localStorageKey, stateToSave)
  }, [
    filters,
    activeSorts, 
    visibleColumns, 
    localStorageKey, 
    isStateLoaded, 
    paginationFromQueryParams, 
    internalCurrentPage, 
    internalPageSize
  ])

  useEffect(() => {
    if (!paginationFromQueryParams) setInternalCurrentPage(1)
  }, [filters, activeSorts, internalPageSize, paginationFromQueryParams])

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Paper withBorder p="md">
        <Text c="dimmed">No data available</Text>
      </Paper>
    )
  }

  const inferredColumnTypes = useMemo(() => {
    const types = {}
    const currencySet = new Set(currencyColumns)
    columns.forEach(column => {
      if (columnFormats[column]) {
        types[column] = columnFormats[column]
        return
      }
      for (const key of Object.keys(columnFormats)) {
        let regex = null
        if (key.startsWith('/') && key.endsWith('/')) {
          regex = new RegExp(key.slice(1, -1))
        }
        if (regex && regex.test(column)) {
          types[column] = columnFormats[key]
          return
        }
      }

      // 3. Currency columns
      // Sample up to 10 values to determine type
      const sampleSize = Math.min(10, data.length)
      const rawSamples = data.slice(0, sampleSize).map(row => row[column])
      
      const isEmptyLike = (val) => 
        val === null || 
        val === undefined || 
        (typeof val === 'string' && val.trim() === '') || 
        String(val).trim() === '-';

      const validSamples = rawSamples.filter(val => !isEmptyLike(val));

      if (validSamples.length > 0) {
        const allValidSamplesAreNumbers = validSamples.every(value => isFinite(Number(value)))
        if (allValidSamplesAreNumbers) {
          if (currencySet.has(column)) {
            types[column] = { type: 'currency', decimals: 2 }
          } else {
            const allAreIntegers = validSamples.every(value => Number.isInteger(Number(value)))
            types[column] = allAreIntegers ? { type: 'number', decimals: 0 } : { type: 'number', decimals: 2 }
          }
        }
      }
    })
    return types
  }, [data, columns, columnFormats, currencyColumns])

  const availableColumns = useMemo(
    () => columns.filter(column => !filters.some(f => f.column === column)),
    [columns, filters]
  )

  const visibleColumnsArray = useMemo(
    () => columns.filter(column => visibleColumns.has(column)),
    [columns, visibleColumns]
  )

  const handleToggleColumn = useCallback(column => {
    setVisibleColumns(prev => {
      const next = new Set(prev)
      if (next.has(column)) next.delete(column)
      else next.add(column)
      return next
    })
  }, [])

  const processedData = useMemo(() => {
    if (Object.keys(activeFilters).length === 0 && Object.keys(activeSorts).length === 0) return data
    let result = [...data]
    if (Object.keys(activeFilters).length > 0) {
      result = result.filter(row => {
        return Object.entries(activeFilters).every(([column, filter]) => {
          if (!filter.value) return true
          const cellValue = row[column]
          if (cellValue === null || cellValue === undefined || cellValue === '') return false
          if (filter.type === 'number' || filter.type === 'percent') {
            const numValue = Number(cellValue)
            const filterValue = Number(filter.value)
            if (isNaN(numValue)) return false
            switch (filter.operator) {
              case 'equals': return numValue === filterValue
              case 'greater': return numValue > filterValue
              case 'less': return numValue < filterValue
              default: return true
            }
          } else {
            return String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase())
          }
        })
      })
    }
    if (Object.keys(activeSorts).length > 0) {
      result.sort((a, b) => {
        for (const [column, sort] of Object.entries(activeSorts)) {
          const aValue = a[column]
          const bValue = b[column]
          const multiplier = sort.direction === 'asc' ? 1 : -1
          if (aValue === null || aValue === undefined) return 1 * multiplier
          if (bValue === null || bValue === undefined) return -1 * multiplier
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            const diff = aValue - bValue
            if (diff !== 0) return diff * multiplier
          } else {
            const diff = String(aValue).localeCompare(String(bValue))
            if (diff !== 0) return diff * multiplier
          }
        }
        return 0
      })
    }
    return result
  }, [data, activeFilters, activeSorts])

  const totalRows = processedData.length
  const currentPage = paginationFromQueryParams ? propCurrentPage : internalCurrentPage
  const pageSize = paginationFromQueryParams ? propPageSize : internalPageSize
  const setCurrentPage = paginationFromQueryParams ? onPageChange : setInternalCurrentPage
  const setPageSize = paginationFromQueryParams ? onPageSizeChange : setInternalPageSize
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return processedData.slice(start, end)
  }, [processedData, currentPage, pageSize])

  const handleAddFilter = useCallback(column => {
    let type = inferredColumnTypes[column]?.type || 'text'
    if (type === 'percent') type = 'number'
    setFilters(prev => [...prev, { column, type }])
    setCurrentPage(1)
  }, [inferredColumnTypes, setCurrentPage])

  const handleRemoveFilter = useCallback(index => {
    setFilters(prev => {
      const newFilters = [...prev]
      newFilters.splice(index, 1)
      const column = prev[index].column
      setActiveFilters(prev => {
        const { [column]: removed, ...rest } = prev
        return rest
      })
      return newFilters
    })
    setCurrentPage(1)
  }, [setCurrentPage])

  const handleFilterChange = useCallback((index, field, value) => {
    setFilters(prev => {
      const newFilters = [...prev]
      newFilters[index] = { ...newFilters[index], [field]: value }
      const filter = newFilters[index]
      setActiveFilters(prev => {
        if (filter.operator && filter.value) {
          return {
            ...prev,
            [filter.column]: filter
          }
        } else {
          const { [filter.column]: removed, ...rest } = prev
          return rest
        }
      })
      return newFilters
    })
    if (typeof setCurrentPage === 'function') setCurrentPage(1)
  }, [setCurrentPage])

  const handleSort = useCallback((column, direction) => {
    setActiveSorts(prev => {
      if (prev[column]?.direction === direction) {
        const { [column]: removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [column]: { direction }
      }
    })
  }, [])

  return (
    <Paper withBorder p="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          {title && <Text fw={500}>{title}</Text>}
          <Group gap="xs">
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconColumns size={16} />}
                >
                  Columns
                </Button>
              </Menu.Target>
              <Menu.Dropdown style={{ maxHeight: 400, overflowY: 'auto' }}>
                <Menu.Label>Visible Columns</Menu.Label>
                {columns.map(column => (
                  <Menu.Item key={column} closeMenuOnClick={false}>
                    <Checkbox
                      label={formatColumnName(column)}
                      checked={visibleColumns.has(column)}
                      onChange={() => handleToggleColumn(column)}
                    />
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <SearchableSelect
              label="Filter"
              options={availableColumns.map(column => ({
                value: column,
                label: formatColumnName(column)
              }))}
              onSelect={handleAddFilter}
              placeholder="Search columns..."
              width={300}
              refreshable={false}
              buttonProps={{
                size: 'xs',
                variant: 'light',
                leftSection: <IconPlus size={14} />
              }}
            />
          </Group>
        </Group>

        {filters.length > 0 && (
          <Group gap="xs" wrap="wrap">
            {filters.map((filter, index) => (
              <Stack key={index} gap={4}>
                <Group gap={4} wrap="nowrap">
                  <Text size="xs" fw={700} style={{ lineHeight: 1.2 }}>
                    {formatColumnName(filter.column)}
                  </Text>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveFilter(index)}
                    size="xs"
                  >
                    <IconX size={12} />
                  </ActionIcon>
                </Group>
                <Group gap={4} wrap="nowrap">
                  <Select
                    value={filter.operator}
                    onChange={value => handleFilterChange(index, 'operator', value)}
                    data={
                      filter.type === 'number' || filter.type === 'percent'
                        ? [
                            { value: 'equals', label: '=' },
                            { value: 'greater', label: '>' },
                            { value: 'less', label: '<' }
                          ]
                        : [
                            { value: 'contains', label: 'Contains' },
                            { value: 'equals', label: 'Equals' }
                          ]
                    }
                    size="xs"
                    style={{ maxWidth: 100 }}
                  />
                  {filter.type === 'number' || filter.type === 'percent' ? (
                    <NumberInput
                      value={filter.value || ''}
                      onChange={value => handleFilterChange(index, 'value', value)}
                      placeholder="Value"
                      size="xs"
                      style={{ maxWidth: 100 }}
                    />
                  ) : (
                    <TextInput
                      value={filter.value || ''}
                      onChange={e => handleFilterChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      size="xs"
                      style={{ maxWidth: 200 }}
                    />
                  )}
                </Group>
              </Stack>
            ))}
          </Group>
        )}

        <Table.ScrollContainer type="native">
          <Table highlightOnHover size="sm">
            <Table.Thead>
              <Table.Tr>
                {visibleColumnsArray.map((column, colIdx) => (
                  <Table.Th
                    key={column}
                    className={colIdx === 0 ? classes.stickyCol : undefined}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Menu position="bottom-start" withinPortal>
                      <Menu.Target>
                        <Group gap="xs" wrap="nowrap">
                          <Text size="xs" fw={500} style={{ cursor: 'pointer' }}>
                            {formatColumnName(column)}
                          </Text>
                          {activeSorts[column] && (
                            <ActionIcon variant="subtle" color="blue" size="xs">
                              {activeSorts[column].direction === 'asc' ? (
                                <IconSortAscending size={14} />
                              ) : (
                                <IconSortDescending size={14} />
                              )}
                            </ActionIcon>
                          )}
                        </Group>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconSortAscending size={14} />} onClick={() => handleSort(column, 'asc')}>
                          Sort Ascending
                        </Menu.Item>
                        <Menu.Item leftSection={<IconSortDescending size={14} />} onClick={() => handleSort(column, 'desc')}>
                          Sort Descending
                        </Menu.Item>
                        <Menu.Item leftSection={<IconEye size={14} />} onClick={() => handleToggleColumn(column)}>
                          Hide Column
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((row, index) => (
                <Table.Tr key={index}>
                  {visibleColumnsArray.map((column, colIdx) => (
                    <Table.Td
                      key={`${index}-${column}`}
                      className={colIdx === 0 ? classes.stickyCol : undefined}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Text size="xs">
                        {formatCellValue(
                          row[column],
                          column,
                          inferredColumnTypes[column] || columnFormats[column],
                          row
                        )}
                      </Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Group justify="space-between" align="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="sm"
            withEdges
            disabled={totalPages <= 1}
          />
          <Select
            value={String(pageSize)}
            onChange={val => setPageSize(Number(val))}
            data={['10', '25', '50', '100'].map(n => ({ value: n, label: `${n} / page` }))}
            size="xs"
            style={{ width: 150 }}
          />
        </Group>
      </Stack>
    </Paper>
  )
}

function formatColumnName(column) {
  return startCase(column)
}

function formatCellValue(value, column, format, row) {
  if (value === null || value === undefined) return '-'
  if (format) {
    if (format.type === 'link') {
      let url = '#'
      if (typeof format.urlTemplate === 'function') {
        url = format.urlTemplate(value, row)
      } else if (typeof format.urlTemplate === 'string') {
        url = format.urlTemplate.replace(/\{([^}]+)\}/g, (match, columnName) => {
          return row[columnName] !== undefined ? row[columnName] : match
        })
      }
      return (
        <Text component="a" href={url} target="_blank" rel="noopener noreferrer" c="blue">
          {value}
        </Text>
      )
    }
    if (format.type === 'number') {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        const decimals = typeof format.decimals === 'number' ? format.decimals : 2
        return numValue.toFixed(decimals)
      }
    }
    if (format.type === 'currency') {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        const decimals = typeof format.decimals === 'number' ? format.decimals : 2
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(numValue)
      }
    }
    if (format.type === 'percent') {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        const decimals = typeof format.decimals === 'number' ? format.decimals : 2
        return `${numValue.toFixed(decimals)}%`
      }
    }
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleString()
  if (typeof value === 'object') return JSON.stringify(value)
  return value.toString()
}

export default DataTable 