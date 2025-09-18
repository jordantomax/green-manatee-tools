import { useState, useCallback, useEffect } from 'react'
import api from '@/api'
import { Filter, Sort } from '@/utils/filter-sort'
import usePersistentState from '@/hooks/usePersistentState'
import useAsync from '@/hooks/useAsync'

export default function useViews(persistentStateKey, resourceType) {
  const [views, setViews] = useState([])
  const [filters, setFilters] = usePersistentState(`${persistentStateKey}-filters`, [])
  const [sorts, setSorts] = usePersistentState(`${persistentStateKey}-sorts`, [])
  const [activeViewId, setActiveViewId] = usePersistentState(`${persistentStateKey}-activeViewId`, null)
  const [newlyAddedFilterId, setNewlyAddedFilterId] = useState(null)
  const { run, isLoading, loadingStates } = useAsync()

  const getViewById = useCallback((viewId) => {
    return views.find(view => String(view.id) === viewId) || null
  }, [views])

  const viewHandlers = {
    load: useCallback(() => {
      return run(async () => {
        const viewsData = await api.listViews(resourceType)
        setViews(viewsData.map(view => ({ ...view, id: String(view.id) })))
      }, 'loadViews')
    }, [resourceType, run]),

    create: useCallback(() => {
      return run(async () => {
        const newView = await api.createView({
          name: 'New View',
          resourceType,
          filter: Filter.toAPI(filters),
          sort: Sort.toAPI(sorts)
        })
        setViews(prev => [...prev, { ...newView, id: String(newView.id) }])
      }, 'createView')
    }, [resourceType, filters, sorts, run]),

    update: useCallback((viewId, {filters, sorts, ...updates}) => {
      updates.filter = Filter.toAPI(filters)
      updates.sort = Sort.toAPI(sorts)
      return run(async () => {
        await api.updateView(viewId, updates)
        setViews(prev => prev.map(view => 
          view.id === viewId ? { ...view, ...updates } : view
        ))
      }, 'updateView')
    }, [run]),

    remove: useCallback((viewId) => {
      return run(async () => {
        await api.deleteView(viewId)
        setViews(prev => prev.filter(view => view.id !== viewId))
      }, 'removeView')
    }, [run]),

    setActive: useCallback((viewId) => {
      setActiveViewId(viewId)
    }, [setActiveViewId])
  }

  const filterHandlers = {
    add: useCallback((column) => {
      const filter = Filter.create(column)
      setFilters([...filters, filter])
      setNewlyAddedFilterId(filter.id)
      // Clear the signal after component re-renders
      setTimeout(() => setNewlyAddedFilterId(null), 0)
    }, [filters, setFilters]),

    remove: useCallback((filterId) => {
      const newFilters = filters.filter(f => f.id !== filterId)
      setFilters(newFilters)
    }, [filters, setFilters]),

    update: useCallback((filterId, condition, value) => {
      const newFilters = filters.map(f => 
        f.id === filterId ? { ...f, condition, value } : f
      )
      setFilters(newFilters)
    }, [filters, setFilters])
  }

  const sortHandlers = {
    add: useCallback((column) => {
      const newSort = Sort.create(column)
      const currentSorts = sorts || []
      setSorts([...currentSorts, newSort])
    }, [sorts, setSorts]),

    remove: useCallback((sortId) => {
      const newSorts = sorts.filter(s => s.id !== sortId)
      setSorts(newSorts)
    }, [sorts, setSorts]),

    update: useCallback((sortId, column, direction) => {
      const newSorts = sorts.map(s => 
        s.id === sortId ? { ...s, column, direction } : s
      )
      setSorts(newSorts)
    }, [sorts, setSorts])
  }

  useEffect(() => {
    viewHandlers.load()
  }, [])

  useEffect(() => {
    if (views.length > 0 && !activeViewId) {
      setActiveViewId(String(views[0].id))
    }
  }, [views])
  
  useEffect(() => {
    const activeView = getViewById(activeViewId)

    if (activeView) {
      setFilters(Filter.fromAPI(activeView.filter))
      setSorts(Sort.fromAPI(activeView.sort))
    }
  }, [activeViewId])

  useEffect(() => {
    const activeView = getViewById(activeViewId)

    if (activeView) {
      viewHandlers.update(activeView.id, { filters, sorts })
    }
  }, [filters, sorts])

  return {
    views,
    filters,
    sorts,
    activeViewId,
    viewHandlers,
    filterHandlers,
    sortHandlers,
    newlyAddedFilterId,
    isLoading,
    loadingStates,
  }
}