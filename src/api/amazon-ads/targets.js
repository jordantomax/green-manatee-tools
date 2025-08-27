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

export async function listNegativeTargets(adGroupIds) {
  return call(`amazon/ads/negative-targets/list`, {
    method: 'POST',
    body: { adGroupIds }
  })
}

export async function createNegativeTarget({ campaignId, adGroupId, expressionValue, expressionType }) {
  return call(`amazon/ads/negative-targets`, {
    method: 'POST',
    body: {
      campaignId,
      adGroupId,
      expressionValue,
      expressionType
    }
  })
}

export async function deleteNegativeTarget(targetId) {
  return call(`amazon/ads/negative-targets/${targetId}`, {
    method: 'DELETE'
  })
}