import { useState } from 'react'

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange
  }
} 