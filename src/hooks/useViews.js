import { useState, useCallback, useEffect } from 'react'
import api from '@/api'
import { Filter, Sort } from '@/utils/filter-sort'

export default function useViewHandlers(resourceType, currentFilters, currentSorts) {
  const [views, setViews] = useState([])

  // Load views on mount
  useEffect(() => {
    const loadViews = async () => {
      const viewsData = await api.listViews(resourceType)
      setViews(viewsData)
    }
    loadViews()
  }, [resourceType])
  const create = useCallback(async () => {
    const newView = await api.createView({
      name: 'New View',
      resourceType,
      filter: Filter.toAPI(currentFilters),
      sort: Sort.toAPI(currentSorts)
    })
    setViews(prev => [...prev, newView])
  }, [resourceType, currentFilters, currentSorts])

  const update = useCallback(async (viewId, updates) => {
    await api.updateView(viewId, updates)
    setViews(prev => prev.map(view => 
      view.id === viewId ? { ...view, ...updates } : view
    ))
  }, [])

  const remove = useCallback(async (viewId) => {
    await api.deleteView(viewId)
    setViews(prev => prev.filter(view => view.id !== viewId))
  }, [])

  return {
    views,
    handlers: {
      create,
      update,
      remove
    }
  }
}
