import { call } from '../core'

export async function getTarget(targetId, adGroupId) {
  return call(`amazon/ads/targets/${targetId}?adGroupId=${adGroupId}`, {
    method: 'GET'
  })
}

export async function updateTarget(targetId, body) {
  return call(`amazon/ads/targets/${targetId}`, {
    method: 'POST',
    body
  })
}
