import { getSavedTokens } from './auth'
import { deepToCamelCase } from './deepMap'

const API_URL = import.meta.env.VITE_API_URL

async function call (path, _options = {}) {
  const { method, params, body } = _options
  const tokens = await getSavedTokens()
  const key = tokens.apiGateway
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

  const res = await fetch(url, options).then(res => res.json())
  return deepToCamelCase(res)
}

async function notionQueryDatabase (databaseId) {
  const res = await call(`notion/database/${databaseId}`, {
    method: 'POST'
  })
  return res.results
}

async function notionGetPage (pageId) {
  const res = await call(`notion/page/${pageId}`, {
    method: 'GET'
  })
  return res
}

async function getRecs () {
  const res = await call(`recommendations`, {
    method: 'GET',
  })
  return res
}

async function createFbaShipments (products) {
  const shipments = products
    .reduce((acc, product) => {
      if (
        product.restock?.needFbaRestock &&
        product.warehouse?.notionProductId
      ) {
        acc.push(product)
      }
      return acc
    }, [])
    .map(({ warehouse, restock  }) => ({
      notionProductId: warehouse.notionProductId,
      notionCartonTemplateId: warehouse.notionCartonTemplateId,
      cartonQty: Math.ceil(restock.fba/warehouse.cartonUnitQty) + 1
  }))
  const res = await call(`notion/fba-shipments`, {
    method: 'POST',
    body: shipments
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
  const res = await call(`shippo/purchase-label`, {
    method: 'POST',
    body
  })
  return res
}

async function shippoGetLabel (params) {
  const res = await call(`shippo/label`, {
    method: 'GET',
    params
  })
  return res
}

const api = {
  call,
  notionQueryDatabase,
  notionGetPage,
  getRecs,
  createFbaShipments,
  createManifest,
  shippoGetRates,
  shippoPurchaseLabel,
  shippoGetLabel
}

export default api