import { getSavedTokens } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL

const RESOURCE_ALIASES = {
  'locations': ['location', 'locations', 'origin', 'destination'],
  'products': ['product'],
  'runs': ['run'], 
  'carton-templates': ['cartonTemplate'],
  'shipments': ['shipment', 'shipments']
}

const RESOURCE_ENDPOINTS = Object.entries(RESOURCE_ALIASES).reduce((acc, [endpoint, aliases]) => {
  aliases.forEach(alias => acc[alias] = endpoint)
  return acc
}, {})

function resourceUrl(resource) {
  return RESOURCE_ENDPOINTS[resource] || `${resource}s`
}

let notificationHandler = null
let isRefreshing = false
let refreshPromise = null
let tokensHandler = null

export function setNotificationHandler(handler) {
  notificationHandler = handler
}

export function setTokensHandler(handler) {
  tokensHandler = handler
}

export async function call (path, _options = {}) {
  const { method, params, body, autoRefresh = true, headers = {} } = _options
  const tokens = await getSavedTokens()
  const options = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (tokens.access) {
    options.headers['Authorization'] = `Bearer ${tokens.access}`
  }

  const url = new URL(`${API_URL}/${path}`)
  if (options.method === 'GET' && params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.append(key, value)
    })
  } else if (options.method !== 'GET' && body) {
    options.body = JSON.stringify(body)
  }

  try {
    let response = await fetch(url, options)
    
    // Unauthorized
    if (response.status === 401 && tokens.access && autoRefresh) {
      const data = await refreshToken()
      if (tokensHandler) await tokensHandler(data)
      options.headers['Authorization'] = `Bearer ${data.accessToken}`
      response = await fetch(url, options)
    }
    
    // No Content
    if (response.status === 204 && response.ok) {
      return null
    }

    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.detail || 'API request failed')
      error.status = response.status
      error.data = data
      throw error
    }
    
    return data
  } catch (error) {
    if (notificationHandler) {
      const metadata = []
      if (error.status != null) {
        metadata.push({ label: 'Status', value: error.status.toString() })
      }
      if (error.data != null) {
        metadata.push({ label: 'Data', value: JSON.stringify(error.data) })
      }
      notificationHandler('error', error.message || 'API request failed', metadata)
    }
    throw error // propagate error to the caller
  }
}

async function refreshToken() {
  if (isRefreshing) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const tokens = await getSavedTokens()
      return call('auth/refresh', { 
        method: 'POST',
        autoRefresh: false,
        body: {
          refreshToken: tokens.refresh
        }
      })
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// Generic resource operations
export async function queryResources (resource, body={}) {
  return call(`${resourceUrl(resource)}`, {
    method: 'POST',
    body
  })
}

export async function getResource (resource, pageId) {
  return call(`${resourceUrl(resource)}/${pageId}`, {
    method: 'GET'
  })
}

export async function getResources (obj, relationNames) {
  const resources = await Promise.all(
    relationNames.map(async (relationName) => {
      const relation = obj.properties[relationName]
      if (!relation || !relation.id) return null
      return getResource(relationName, relation.id)
    })
  )
  return resources
}

export { refreshToken }
