import { call } from '../core'

export async function getProductTarget(targetId, adGroupId) {
  return call(`amazon/ads/product-targets/${targetId}?adGroupId=${adGroupId}`, {
    method: 'GET'
  })
}

export async function updateProductTarget(targetId, body) {
  return call(`amazon/ads/product-targets/${targetId}`, {
    method: 'POST',
    body
  })
}