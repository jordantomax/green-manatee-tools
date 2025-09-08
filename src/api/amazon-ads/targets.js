import { call } from '../core'

export async function listTargets({ filters }) {
  return call(`amazon/ads/targets/list`, {
    method: 'POST',
    body: { filters }
  })
}

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

export async function archiveTargets(targetIds) {
  return call(`amazon/ads/targets/archive`, {
    method: 'POST',
    body: { targetIds }
  })
}

export async function listNegativeTargets({ filters }) {
  return call(`amazon/ads/negative-targets/list`, {
    method: 'POST',
    body: { filters }
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