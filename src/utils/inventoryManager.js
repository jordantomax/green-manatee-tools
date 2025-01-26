import { INVENTORY_MANAGER_API_URL } from '../constants'
import { getSavedTokens } from './auth'
import { deepToCamelCase } from './deepMap'

async function call (path, _options = {}) {
  const { method, params } = _options
  const tokens = await getSavedTokens()
  const key = tokens.apiGateway
  const options = {
    method: method || 'GET',
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    }
  }
  if (options.method !== 'GET') {
    options.body = JSON.stringify(params || {})
  }

  const res = await fetch(`${INVENTORY_MANAGER_API_URL}/${path}`, options).then(res => res.json())
  return deepToCamelCase(res)
}

async function getRecs (options) {
  const res = await call(`recommendations`, {
    options
  })
  return res
}

const inventoryManager = {
  call,
  getRecs
}

export default inventoryManager
