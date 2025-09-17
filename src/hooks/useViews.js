import { useState, useCallback, useEffect } from 'react'
import api from '@/api'
import { Filter, Sort } from '@/utils/filter-sort'
import usePersistentState from '@/hooks/usePersistentState'

export default function useViews(persistentStateKey, resourceType) {
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

  const filterHandlers = {
    add: useCallback((column) => {
      const filter = Filter.create(column)
      setFilters([...filters, filter])
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