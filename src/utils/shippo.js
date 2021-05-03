import shippo from 'shippo'

import { getSavedToken } from './auth'
import { deepToSnakeCase } from './deepMap'

async function callShippo (resource, action, input = {}) {
  input.async = false
  const token = await getSavedToken()
  const session = shippo(token)
  return session[resource][action](deepToSnakeCase(input))
}

export default callShippo
