import { Group, Select, Pagination } from '@mantine/core'
import { memo } from 'react'

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '25', label: '25 / page' },
  { value: '50', label: '50 / page' },
  { value: '100', label: '100 / page' }
]

const TablePagination = memo(function TablePagination({ 
  currentPage, 
  pageSize, 
  totalPages,
  handlePageChange, 
  handlePageSizeChange 
}) {
  return (
    <Group justify="space-between" align="center" mt="md">
      <Pagination
        value={currentPage}
        onChange={handlePageChange}
        total={totalPages}
        size="sm"
        withEdges
        disabled={totalPages <= 1}
      />
      <Select
        value={String(pageSize)}
        onChange={handlePageSizeChange}
        data={PAGE_SIZE_OPTIONS}
        size="xs"
        style={{ width: 150 }}
      />
    </Group>
  )
})

export default TablePagination 