import { call } from '../core'

export async function listKeywords({ adGroupIds, keywordIds }) {
  return call(`amazon/ads/keywords/list`, {
    method: 'POST',
    body: {
      adGroupIds,
      keywordIds
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

export async function listNegativeKeywords({ adGroupIds }) {
  return call(`amazon/ads/negative-keywords/list`, {
    method: 'POST',
    body: {
      adGroupIds
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

export async function deleteNegativeKeyword(negativeKeywordId) {
  return call(`amazon/ads/negative-keywords/${negativeKeywordId}`, {
    method: 'DELETE',
  })
}
