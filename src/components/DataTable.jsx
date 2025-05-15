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

function DataTable({ data, title, columnFormats = {}, tableId, currencyColumns = [], paginationFromQueryParams = false, currentPage: propCurrentPage, pageSize: propPageSize, onPageChange, onPageSizeChange }) {
  const localStorageKey = useMemo(() => {
    if (!tableId) {
      console.warn("DataTable: 'tableId' prop is missing. Table persistence disabled for this instance.")
      return null
    }
    return `dataTableState-${tableId}`
  }, [tableId])

  const [filters, setFilters] = useState([])
  const [sorts, setSorts] = useState([])
  const [activeFilters, setActiveFilters] = useState({})
  const [activeSorts, setActiveSorts] = useState({})
  const [visibleColumns, setVisibleColumns] = useState(new Set())
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  // Internal pagination state (used if not using query params)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(100)

  // Get all unique keys from the data objects, sorted alphabetically
  // Memoize this as it depends on `data`
  const columns = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }
    return Object.keys(data[0] || {}).sort()
  }, [data])

  // Load state from local storage on mount or when data/key changes
  useEffect(() => {
    if (!localStorageKey) {
      if (columns.length > 0) { // Use memoized, sorted columns
        setVisibleColumns(new Set(columns))
      }
      setIsStateLoaded(true)
      return
    }

    let stateAppliedFromStorage = false
    try {
      const savedState = getLocalData(localStorageKey)
      if (savedState) {
        if (savedState.savedFilters && Array.isArray(savedState.savedFilters)) {
          setFilters(savedState.savedFilters)
          // Also update activeFilters based on the loaded filters
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
        } else if (columns.length > 0) { // Use memoized, sorted columns
          setVisibleColumns(new Set(columns))
        }
        // Only restore pagination state if not using query params
        if (!paginationFromQueryParams) {
          if (typeof savedState.savedCurrentPage === 'number') setInternalCurrentPage(savedState.savedCurrentPage)
          if (typeof savedState.savedPageSize === 'number') setInternalPageSize(savedState.savedPageSize)
        }
        stateAppliedFromStorage = true
      }
    } catch (error) {
      console.error(`Failed to load table state for key "${localStorageKey}" from local storage:`, error)
    }

    if (!stateAppliedFromStorage && columns.length > 0) { // Use memoized, sorted columns
      setVisibleColumns(new Set(columns))
    }
    setIsStateLoaded(true)
  }, [localStorageKey, columns, paginationFromQueryParams]) // Depend on memoized columns and mode

  // Save state to local storage when it changes, but only after initial load attempt
  useEffect(() => {
    if (!localStorageKey || !isStateLoaded) return // Don't save if persistence disabled or initial load not done

    try {
      const stateToSave = {
        savedFilters: filters,
        savedActiveSorts: activeSorts,
        savedVisibleColumns: Array.from(visibleColumns),
      }
      // Only save pagination state if not using query params
      if (!paginationFromQueryParams) {
        stateToSave.savedCurrentPage = internalCurrentPage
        stateToSave.savedPageSize = internalPageSize
      }
      setLocalData(localStorageKey, stateToSave)
    } catch (error) {
      console.error(`Failed to save table state for key "${localStorageKey}" to local storage:`, error)
    }
  }, [filters, activeSorts, visibleColumns, localStorageKey, isStateLoaded, paginationFromQueryParams, internalCurrentPage, internalPageSize])

  // Reset currentPage to 1 when filters, sorts, or pageSize change (only for internal state)
  useEffect(() => {
    if (!paginationFromQueryParams) {
      setInternalCurrentPage(1)
    }
  }, [filters, activeSorts, internalPageSize, paginationFromQueryParams])

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Paper withBorder p="md">
        <Text c="dimmed">No data available</Text>
      </Paper>
    )
  }

  // Infer column types from the data
  const inferredColumnTypes = useMemo(() => {
    const types = {}
    const currencySet = new Set(currencyColumns);

    columns.forEach(column => {
      // 1. Direct columnFormats prop takes precedence (exact match)
      if (columnFormats[column]) {
        types[column] = columnFormats[column]
        return
      }

      // 2. Pattern-based formats: check for RegExp keys in columnFormats
      for (const key of Object.keys(columnFormats)) {
        // If the key is a RegExp (not a string), test it
        const maybeRegex = key;
        let regex = null;
        // Try to parse string keys that look like regexes (e.g., /^acos/)
        if (maybeRegex instanceof RegExp) {
          regex = maybeRegex;
        } else {
          // Try to parse string keys that look like regexes
          try {
            if (maybeRegex.startsWith('/') && maybeRegex.endsWith('/')) {
              regex = new RegExp(maybeRegex.slice(1, -1));
            }
          } catch (e) {}
        }
        if (regex && regex.test(column)) {
          types[column] = columnFormats[key];
          return;
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
        const allValidSamplesAreNumbers = validSamples.every(value => {
          const num = Number(value);
          return isFinite(num); // Checks for actual numbers, excluding NaN and Infinity
        });

        if (allValidSamplesAreNumbers) {
          if (currencySet.has(column)) {
            types[column] = { type: 'currency', decimals: 2 };
          } else {
            const allAreIntegers = validSamples.every(value => {
              const num = Number(value);
              return Number.isInteger(num);
            });

            if (allAreIntegers) {
              types[column] = { type: 'number', decimals: 0 };
            } else {
              types[column] = { type: 'number', decimals: 2 }; 
            }
          }
        }
      }
    })
    return types
  }, [data, columns, columnFormats, currencyColumns])

  // Get available columns for filtering (excluding already filtered columns)
  const availableColumns = useMemo(() => 
    columns.filter(column => !filters.some(f => f.column === column))
  , [columns, filters])

  // Memoize visible columns array to prevent unnecessary recalculations
  const visibleColumnsArray = useMemo(() => 
    columns.filter(column => visibleColumns.has(column))
  , [columns, visibleColumns])

  const handleToggleColumn = useCallback((column) => {
    setVisibleColumns(prev => {
      const next = new Set(prev)
      if (next.has(column)) {
        next.delete(column)
      } else {
        next.add(column)
      }
      return next
    })
  }, [])

  // Apply filters and sorts to the data
  const processedData = useMemo(() => {
    // If no filters or sorts are active, return the original data
    if (Object.keys(activeFilters).length === 0 && Object.keys(activeSorts).length === 0) {
      return data
    }

    let result = [...data]

    // Apply filters
    if (Object.keys(activeFilters).length > 0) {
      result = result.filter(row => {
        // Check all active filters
        return Object.entries(activeFilters).every(([column, filter]) => {
          if (!filter.value) return true

          const cellValue = row[column]
          
          // Skip null/undefined/empty values unless explicitly filtering for them
          if (cellValue === null || cellValue === undefined || cellValue === '') {
            return false
          }

          // Treat percent as number for filtering
          if (filter.type === 'number' || filter.type === 'percent') {
            const numValue = Number(cellValue)
            const filterValue = Number(filter.value)
            
            // Skip if the value isn't a valid number
            if (isNaN(numValue)) {
              return false
            }

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

    // Apply sorts
    if (Object.keys(activeSorts).length > 0) {
      result.sort((a, b) => {
        // Check each sort in order
        for (const [column, sort] of Object.entries(activeSorts)) {
          const aValue = a[column]
          const bValue = b[column]
          const multiplier = sort.direction === 'asc' ? 1 : -1
          
          // Handle null/undefined values in sorting
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

  const handleAddFilter = useCallback((column) => {
    let type = inferredColumnTypes[column]?.type || 'text'
    if (type === 'percent') type = 'number'
    setFilters(prev => [...prev, { column, type }])
  }, [inferredColumnTypes])

  const handleRemoveFilter = useCallback((index) => {
    setFilters(prev => {
      const newFilters = [...prev]
      newFilters.splice(index, 1)
      
      // Remove from active filters if exists
      const column = prev[index].column
      setActiveFilters(prev => {
        const { [column]: removed, ...rest } = prev
        return rest
      })
      
      return newFilters
    })
  }, [])

  const handleFilterChange = useCallback((index, field, value) => {
    setFilters(prev => {
      const newFilters = [...prev]
      newFilters[index] = { ...newFilters[index], [field]: value }
      
      // Update active filters
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
  }, [])

  const handleSort = useCallback((column, direction) => {
    setActiveSorts(prev => {
      // If clicking the same direction, remove the sort
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

  // Pagination logic
  const totalRows = processedData.length;
  // Use props if in query param mode, otherwise use internal state
  const currentPage = paginationFromQueryParams ? propCurrentPage : internalCurrentPage;
  const pageSize = paginationFromQueryParams ? propPageSize : internalPageSize;
  const setCurrentPage = paginationFromQueryParams ? onPageChange : setInternalCurrentPage;
  const setPageSize = paginationFromQueryParams ? onPageSizeChange : setInternalPageSize;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pageSize]);

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
                    onChange={(value) => handleFilterChange(index, 'operator', value)}
                    data={filter.type === 'number' || filter.type === 'percent'
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
                  {(filter.type === 'number' || filter.type === 'percent') ? (
                    <NumberInput
                      value={filter.value || ''}
                      onChange={(value) => handleFilterChange(index, 'value', value)}
                      placeholder="Value"
                      size="xs"
                      style={{ maxWidth: 100 }}
                    />
                  ) : (
                    <TextInput
                      value={filter.value || ''}
                      onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
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
                {visibleColumnsArray.map((column) => (
                  <Table.Th key={column} style={{ whiteSpace: 'nowrap' }}>
                    <Menu position="bottom-start" withinPortal>
                      <Menu.Target>
                        <Group gap="xs" wrap="nowrap">
                          <Text size="xs" fw={500} style={{ cursor: 'pointer' }}>
                            {formatColumnName(column)}
                          </Text>
                          {activeSorts[column] && (
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              size="xs"
                            >
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
                        <Menu.Item
                          leftSection={<IconSortAscending size={14} />}
                          onClick={() => handleSort(column, 'asc')}
                        >
                          Sort Ascending
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconSortDescending size={14} />}
                          onClick={() => handleSort(column, 'desc')}
                        >
                          Sort Descending
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconEye size={14} />}
                          onClick={() => handleToggleColumn(column)}
                        >
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
                  {visibleColumnsArray.map((column) => (
                    <Table.Td key={`${index}-${column}`} style={{ whiteSpace: 'nowrap' }}>
                      <Text size="xs">
                        {formatCellValue(row[column], column, inferredColumnTypes[column] || columnFormats[column], row)}
                      </Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {/* Pagination controls */}
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
            onChange={val => { setPageSize(Number(val)); }}
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
  return column
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

function formatCellValue(value, column, format, row) {
  if (value === null || value === undefined) return '-'
  
  // Apply column-specific formatting if available
  if (format) {
    if (format.type === 'link') {
      let url = '#' // Default URL if template processing fails
      if (typeof format.urlTemplate === 'function') {
        try {
          url = format.urlTemplate(value, row) // Pass value and row to the function
        } catch (error) {
          console.error(`Error executing urlTemplate function for column "${column}":`, error);
        }
      } else if (typeof format.urlTemplate === 'string') {
        // Replace any {columnName} in the URL template with the corresponding value from the row
        url = format.urlTemplate.replace(/\{([^}]+)\}/g, (match, columnName) => {
          return row[columnName] !== undefined ? row[columnName] : match // Ensure row[columnName] exists
        })
      } else {
        console.warn(`Invalid urlTemplate for column "${column}": Expected string or function, got ${typeof format.urlTemplate}`);
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

  // Default formatting
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleString()
  if (typeof value === 'object') return JSON.stringify(value)
  return value.toString()
}

export default DataTable 