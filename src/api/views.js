import { call } from './core'
import { Filter, Sort } from '@/utils/filter-sort'

const viewFromAPI = (view) => ({
  ...view,
  id: String(view.id),
  filters: Filter.fromAPI(view.filter),
  sorts: Sort.fromAPI(view.sort),
  settings: view.settings || {}
})

export async function createView ({ name, resourceType, filters, sorts, settings }) {
  const view = await call('views', {
    method: 'POST',
    body: { 
      name, 
      resourceType, 
      filter: Filter.toAPI(filters), 
      sort: Sort.toAPI(sorts),
      settings: settings ?? null
    }
  })
  
  return viewFromAPI(view)
}

export async function listViews (resourceType) {
  const views = await call('views', {
    method: 'GET',
    params: { resourceType }
  })
  
  return views.map(viewFromAPI)
}

export async function getView (viewId) {
  const view = await call(`views/${viewId}`, {
    method: 'GET'
  })
  
  return viewFromAPI(view)
}

export async function updateView (viewId, { name, resourceType, filters, sorts, settings }) {
  const view = await call(`views/${viewId}`, {
    method: 'PUT',
    body: { 
      name, 
      resourceType, 
      filter: Filter.toAPI(filters), 
      sort: Sort.toAPI(sorts),
      settings: settings ?? null
    }
  })
  
  return viewFromAPI(view)
}

export async function deleteView (viewId) {
  return call(`views/${viewId}`, {
    method: 'DELETE'
  })
}
