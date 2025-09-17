import { useState, useCallback, useEffect } from 'react'
import api from '@/api'
import { Filter, Sort } from '@/utils/filter-sort'
import useFilterHandlers from '@/hooks/useFilterHandlers'
import useSortHandlers from '@/hooks/useSortHandlers'
import usePersistentState from '@/hooks/usePersistentState'

export default function useViewHandlers(persistentStateKey, resourceType) {
  const [views, setViews] = useState([])
  const [filters, setFilters] = usePersistentState(`${persistentStateKey}-filters`, [])
  const [sorts, setSorts] = usePersistentState(`${persistentStateKey}-sorts`, [])

  const viewHandlers = {
    load: useCallback(async () => {
      const viewsData = await api.listViews(resourceType)
      setViews(viewsData.map(view => ({ ...view, id: String(view.id) })))
    }, [resourceType]),

    create: useCallback(async () => {
      const newView = await api.createView({
        name: 'New View',
        resourceType,
        filter: Filter.toAPI(filters),
        sort: Sort.toAPI(sorts)
      })
      setViews(prev => [...prev, { ...newView, id: String(newView.id) }])
    }, [resourceType, filters, sorts]),

    update: useCallback(async (viewId, updates) => {
      await api.updateView(viewId, updates)
      setViews(prev => prev.map(view => 
        view.id === viewId ? { ...view, ...updates } : view
      ))
    }, []),

    remove: useCallback(async (viewId) => {
      await api.deleteView(viewId)
      setViews(prev => prev.filter(view => view.id !== viewId))
    }, [])
  }

  const filterHandlers = useFilterHandlers(
    filters, setFilters
  )
  const sortHandlers = useSortHandlers(
    sorts, setSorts
  )

  useEffect(() => {
    viewHandlers.load()
  }, [viewHandlers.load])

  return {
    views,
    filters,
    sorts,
    viewHandlers,
    filterHandlers,
    sortHandlers,
  }
}
