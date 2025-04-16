import { getSavedTokens } from './auth'
import { deepToCamelCase } from './deepMap'

const API_URL = import.meta.env.VITE_API_URL

let globalErrorHandler = null

export function setErrorHandler(handler) {
  globalErrorHandler = handler
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
      
      if (globalErrorHandler) {
        globalErrorHandler(error)
      }
      
      throw error
    }
    
    return deepToCamelCase(data)
  } catch (error) {
    if (globalErrorHandler && !error.status) {
      globalErrorHandler(error)
    }
    throw error
  }
}

async function notionQueryDatabase (databaseId, body={}) {
  const res = await call(`notion/database/${databaseId}`, {
    method: 'POST',
    body
  })
  return res.results
}

async function notionGetPage (pageId) {
  const res = await call(`notion/page/${pageId}`, {
    method: 'GET'
  })
  return res
}

async function notionGetRelations (obj, relationNames) {
  const relations = await Promise.all(
    relationNames.map(async (prop) => {
      if (!obj.properties[prop] || obj.properties[prop].relation.length <= 0) return null

      return await Promise.all(
        obj.properties[prop].relation.map(async (r) => {
          if (!r.id) return null
          return await notionGetPage(r.id)
        })
      )
    })
  )
  return relations
}


async function getRecs () {
  const res = await call(`recommendations`, {
    method: 'GET',
  })
  return res
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

  const res = await call(`notion/fba-shipment`, {
    method: 'POST',
    body: shipment
  })
  return res
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
  const res = await call(`shippo/rates`, {
    method: 'POST',
    body
  })
  return res
}

async function shippoPurchaseLabel (body) {
  const res = await call(`shippo/label`, {
    method: 'POST',
    body
  })
  return res
}

async function shippoGetLabels (rateId) {
  const res = await call(`shippo/label/${rateId}`, {
    method: 'GET'
  })
  return res
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

const api = {
  call,
  notionQueryDatabase,
  notionGetPage,
  notionGetRelations,
  getRecs,
  createFbaShipment,
  createManifest,
  shippoGetRates,
  shippoPurchaseLabel,
  shippoGetLabels,
  mergePdfs
}

export default api