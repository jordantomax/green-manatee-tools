import { getSavedTokens } from './auth'

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

let errorHandler = null
let isRefreshing = false
let refreshPromise = null
let tokensHandler = null

export function setErrorHandler(handler) {
  errorHandler = handler
}

export function setTokensHandler(handler) {
  tokensHandler = handler
}

async function call (path, _options = {}) {
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
    
    if (response.status === 401 && tokens.access && autoRefresh) {
      const data = await refreshToken()
      if (tokensHandler) await tokensHandler(data)
      options.headers['Authorization'] = `Bearer ${data.accessToken}`
      response = await fetch(url, options)
    }

    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.detail || 'API request failed')
      error.status = response.status
      throw error
    }
    
    return data
  } catch (error) {
    if (errorHandler) errorHandler(error)
    throw error // propagate error to the caller
  }
}

async function login(email, password) {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

async function signUp(email, password, apiKey) {
  return call('auth/signup', {
    method: 'POST',
    body: {
      email,
      password,
      apiKey
    },
    headers: {
      'Signup-Api-Key': apiKey
    }
  })
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

async function getCurrentUser() {
  return call('auth/me', {
    method: 'GET'
  })
}

async function queryResources (resource, body={}) {
  return call(`${resourceUrl(resource)}`, {
    method: 'POST',
    body
  })
}

async function getResource (resource, pageId) {
  return call(`${resourceUrl(resource)}/${pageId}`, {
    method: 'GET'
  })
}

async function getResources (obj, relationNames) {
  const resources = await Promise.all(
    relationNames.map(async (relationName) => {
      const relation = obj.properties[relationName]
      if (!relation || !relation.id) return null
      return getResource(relationName, relation.id)
    })
  )
  return resources
}

async function getRecs () {
  return call(`recommendations`, {
    method: 'GET',
  })
}

async function createFbaShipment (product) {
  if (!product.restock?.needFbaRestock || !product.warehouse?.notionProductId) {
    return null
  }

  const shipment = {
    notionProductId: product.warehouse.notionProductId,
    notionCartonTemplateId: product.warehouse.notionCartonTemplateId,
    cartonQty: Math.ceil(product.restock.fba/product.warehouse.cartonUnitQty) + 1
  }

  return call(`shipments/fba`, {
    method: 'POST',
    body: shipment
  })
}

async function createManifest (shipments) {
  const res = await call(`amazon/sp/manifest`, {
    method: 'POST',
    body: shipments
  })
  const base64Txt = res.body
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${base64Txt}`
  link.download = 'manifest.txt'
  link.click()
}

async function shippoGetRates (body) {
  return call(`shippo/rates`, {
    method: 'POST',
    body
  })
}

async function shippoPurchaseLabel (body) {
  return call(`shippo/label`, {
    method: 'POST',
    body
  })
}

async function shippoGetLabels (rateId) {
  return call(`shippo/label/${rateId}`, {
    method: 'GET'
  })
}

async function mergePdfs (body) {
  const res = await call(`shippo/merge-pdfs`, {
    method: 'POST',
    body
  })
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${res.body}`
  link.download = 'postage.pdf'
  link.click()
  return res
}

async function getAdsReports() {
  return call('amazon/ads/reports', {
    method: 'GET'
  })
}

async function getAdsReport(reportId) {
  return call(`amazon/ads/reports/${reportId}`, {
    method: 'GET'
  })
}

async function getTaggedAdsReport(reportId) {
  return call(`amazon/ads/reports/${reportId}/tags`, {
    method: 'GET'
  })
}

async function createAdsReport(body) {
  return call('amazon/ads/reports', {
    method: 'POST',
    body
  })
}

async function deleteAdsReport(reportId) {
  return call(`amazon/ads/reports/${reportId}`, {
    method: 'DELETE'
  })
}

async function getAdsSearchTerms(body) {
  return call('amazon/ads/search-terms', {
    method: 'POST',
    body
  })
}

async function getAdsSearchTerm(searchTerm, keywordId, aggregate=false) {
  return call(`amazon/ads/search-terms/${searchTerm}`, {
    params: {
      keywordId,
      aggregate
    },
    method: 'GET'
  })
}

const api = {
  login,
  signUp,
  refreshToken,
  getCurrentUser,
  queryResources,
  getResource,
  getResources,
  getRecs,
  createFbaShipment,
  createManifest,
  shippoGetRates,
  shippoPurchaseLabel,
  shippoGetLabels,
  mergePdfs,
  getAdsReports,
  createAdsReport,
  getAdsReport,
  getTaggedAdsReport,
  deleteAdsReport,
  getAdsSearchTerms,
  getAdsSearchTerm
}

export default api