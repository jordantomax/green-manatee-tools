import { call } from './core'

export async function createView ({ name, resourceType, filter, sort }) {
  return call('views', {
    method: 'POST',
    body: { name, resourceType, filter, sort }
  })
}

export async function listViews (resourceType) {
  return call('views', {
    method: 'GET',
    params: { resourceType }
  })
}

export async function getView (viewId) {
  return call(`views/${viewId}`, {
    method: 'GET'
  })
}

export async function updateView (viewId, { name, resourceType, filter, sort }) {
  return call(`views/${viewId}`, {
    method: 'PUT',
    body: { name, resourceType, filter, sort }
  })
}

export async function deleteView (viewId) {
  return call(`views/${viewId}`, {
    method: 'DELETE'
  })
}
