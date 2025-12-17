import { useState, useCallback, useEffect } from 'react'
import api from '@/api'
import { Filter, Sort } from '@/utils/filter-sort'
import usePersistentState from '@/hooks/usePersistentState'
import useAsync from '@/hooks/useAsync'

export default function useViews(persistentStateKey, resourceType, callbacks = {}) {
  const { onActiveViewChange } = callbacks

  const [views, setViews] = useState([])
  const [filters, setFilters] = usePersistentState(`${persistentStateKey}-filters`, [])
  const [sorts, setSorts] = usePersistentState(`${persistentStateKey}-sorts`, [])
  const [settings, setSettings] = usePersistentState(`${persistentStateKey}-settings`, {})
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
        setViews(viewsData)
      }, 'loadViews')
    }, [resourceType, run]),

    create: useCallback(() => {
      return run(async () => {
        const newView = await api.createView({
          name: 'New View',
          resourceType,
          filters: views.length === 0 ? filters : null,
          sorts: views.length === 0 ? sorts : null,
          settings: views.length === 0 ? settings : null
        })
        setViews(prev => [...prev, newView])
        setActiveViewId(newView.id)
      }, 'createView')
    }, [resourceType, filters, sorts, settings, run, setActiveViewId, views.length]),

    update: useCallback((viewId, updates) => {
      return run(async () => {
        await api.updateView(viewId, updates)
        setViews(prev => prev.map(view => 
          view.id === viewId ? { ...view, ...updates } : view
        ))
      }, 'updateView')
    }, [run]),

    delete: useCallback((viewId) => {
      return run(async () => {
        await api.deleteView(viewId)
        setViews(prevViews => {
          const remainingViews = prevViews.filter(view => view.id !== viewId)
          setActiveViewId(remainingViews[0]?.id ?? null)
          return remainingViews
        })
      }, 'deleteView')
    }, [run]),

    setActive: useCallback((viewId) => {
      setActiveViewId(viewId)
    }, [setActiveViewId])
  }

  const filterHandlers = {
    add: useCallback((column) => {
      const filter = Filter.create(column)
      const newFilters = filters ? [...filters, filter] : [filter]
      setFilters(newFilters)
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

  const settingsHandlers = {
    hideColumn: useCallback((column) => {
      const currentHidden = settings?.hiddenColumns || []
      if (!currentHidden.includes(column)) {
        setSettings({ ...settings, hiddenColumns: [...currentHidden, column] })
      }
    }, [settings, setSettings]),

    showColumn: useCallback((column) => {
      const currentHidden = settings?.hiddenColumns || []
      setSettings({ ...settings, hiddenColumns: currentHidden.filter(col => col !== column) })
    }, [settings, setSettings])
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
      setFilters(activeView.filters)
      setSorts(activeView.sorts)
      setSettings(activeView.settings || {})
      onActiveViewChange?.(activeView)
    }
  }, [activeViewId])

  useEffect(() => {
    const activeView = getViewById(activeViewId)

    if (activeView) {
      viewHandlers.update(activeView.id, { filters, sorts, settings })
    }
  }, [filters, sorts, settings])

  return {
    views,
    viewHandlers,
    activeViewId,

    filters,
    filterHandlers,
    newlyAddedFilterId,

    sorts,
    sortHandlers,

    settings,
    settingsHandlers,

    isLoading,
    loadingStates,
  }
}