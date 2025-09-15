import { useCallback } from 'react'
import { Sort } from '@/utils/filter-sort'

export default function useSortHandlers(sorts, updateSorts) {
  const add = useCallback((column) => {
    const newSort = Sort.create(column)
    const currentSorts = sorts || []
    updateSorts([...currentSorts, newSort])
  }, [sorts, updateSorts])

  const remove = useCallback((sortId) => {
    const newSorts = sorts.filter(s => s.id !== sortId)
    updateSorts(newSorts)
  }, [sorts, updateSorts])

  const update = useCallback((sortId, column, direction) => {
    const newSorts = sorts.map(s => 
      s.id === sortId ? { ...s, column, direction } : s
    )
    updateSorts(newSorts)
  }, [sorts, updateSorts])

  return {
    add,
    remove,
    update
  }
}
