import shippo from 'shippo'

import { getSavedTokens } from './auth'
import { deepToSnakeCase, deepToCamelCase } from './deepMap'

async function callShippo (resource, action, input = {}) {
  input.async = false
  const tokens = await getSavedTokens()
  const session = shippo(tokens.shippo)
  const res = await session[resource][action](deepToSnakeCase(input))
  return deepToCamelCase(res)
}

export default callShippo
