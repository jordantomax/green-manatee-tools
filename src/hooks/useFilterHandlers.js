import { useCallback } from 'react'
import { Filter } from '@/utils/filter-sort'

export default function useFilterHandlers(filters, updateFilters) {
  const add = useCallback((column) => {
    const filter = Filter.create(column)
    updateFilters([...filters, filter])
  }, [filters, updateFilters])

  const remove = useCallback((filterId) => {
    const newFilters = filters.filter(f => f.id !== filterId)
    updateFilters(newFilters)
  }, [filters, updateFilters])

  const update = useCallback((filterId, condition, value) => {
    const newFilters = filters.map(f => 
      f.id === filterId ? { ...f, condition, value } : f
    )
    updateFilters(newFilters)
  }, [filters, updateFilters])

  return {
    add,
    remove,
    update
  }
}
