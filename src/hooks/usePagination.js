import { useCallback } from 'react'
import usePersistentState from './usePersistentState'

export default function usePagination(key, defaultPagination = { page: 1, limit: 10, totalPages: 1 }) {
  const [pagination, setPagination] = usePersistentState(key, defaultPagination)

  const handlers = {
    totalPagesChange: useCallback((newTotalPages) => {
      setPagination(prev => ({ ...prev, totalPages: newTotalPages }))
    }, [setPagination]),

    pageChange: useCallback((newPage) => {
      setPagination(prev => ({ ...prev, page: newPage }))
    }, [setPagination]),

    limitChange: useCallback((newLimit) => {
      setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
    }, [setPagination])
  }

  return {
    pagination,
    handlers
  }
} 