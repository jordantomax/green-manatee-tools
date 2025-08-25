import { call } from '../core'

export async function getProductTarget(asin, adGroupId) {
  return call(`amazon/ads/product-targets/${asin}?adGroupId=${adGroupId}`, {
    method: 'GET'
  })
}
