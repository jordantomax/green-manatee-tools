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

export function setErrorHandler(handler) {
  errorHandler = handler
}

async function call (path, _options = {}) {
  const { method, params, body } = _options
  const tokens = await getSavedTokens()
  const key = tokens.apiKey
  const options = {
    method: method || 'GET',
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    }
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
    const response = await fetch(url, options)
    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.message || 'API request failed')
      error.status = response.status
      error.data = data
      
      throw error
    }
    
    return data
  } catch (error) {
    if (errorHandler) errorHandler(error)
    throw error
  }
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

const api = {
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
  deleteAdsReport
}

export default api