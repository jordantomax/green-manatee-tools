import shippo from 'shippo'

import { getSavedToken } from './auth'
import { deepToSnakeCase, deepToCamelCase } from './deepMap'

async function callShippo (resource, action, input = {}) {
  input.async = false
  const token = await getSavedToken()
  const session = shippo(token)
  const res = await session[resource][action](deepToSnakeCase(input))
  return deepToCamelCase(res)
}

export default callShippo
