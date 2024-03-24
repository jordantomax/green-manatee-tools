import shippo from 'shippo'

import { getSavedTokens } from './auth'
import { deepToSnakeCase, deepToCamelCase } from './deepMap'

async function callShippo (resource, action, input = {}) {
  console.log("calling shippo")
  input.async = false
  const tokens = await getSavedTokens()
  console.log("token: ", tokens)
  const session = shippo(tokens.shippo)
  console.log(session)
  console.log(session[resource][action])
  const res = await session[resource][action](deepToSnakeCase(input))
  console.log('res: ', res)
  return deepToCamelCase(res)
}

export default callShippo
