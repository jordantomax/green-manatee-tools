import { call } from '../core'

export async function listKeywords({ filters }) {
  return call(`amazon/ads/keywords/list`, {
    method: 'POST',
    body: {
      filters
    },
  })
}

export async function getKeywordById(keywordId) {
  return call(`amazon/ads/keywords/${keywordId}`, {
    method: 'GET',
  })
}

export async function updateKeyword(keywordId, body) {
  return call(`amazon/ads/keywords/${keywordId}`, {
    method: 'POST',
    body
  })
}

export async function listNegativeKeywords({ filters }) {
  return call(`amazon/ads/negative-keywords/list`, {
    method: 'POST',
    body: {
      filters
    }
  })
}

export async function createNegativeKeyword({ campaignId, adGroupId, keywordText, matchType='NEGATIVE_EXACT' }) {
  return call(`amazon/ads/negative-keywords`, {
    method: 'POST',
    body: {
      campaignId,
      adGroupId,
      keywordText,
      matchType
    }
  })
}

export async function updateNegativeKeyword(negativeKeywordId, body) {
  return call(`amazon/ads/negative-keywords/${negativeKeywordId}`, {
    method: 'POST',
    body
  })
}

export async function deleteNegativeKeyword(negativeKeywordId) {
  return call(`amazon/ads/negative-keywords/${negativeKeywordId}`, {
    method: 'DELETE',
  })
}
