import { call } from '../core'

export async function getAdsSearchTerms(body) {
  return call('amazon/ads/search-terms', {
    method: 'POST',
    body
  })
}

export async function getAdsSearchTerm(searchTerm, keywordId, aggregate=false) {
  return call(`amazon/ads/search-terms/${searchTerm}`, {
    method: 'GET',
    params: {
      keywordId,
      aggregate
    },
  })
}
