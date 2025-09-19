import { call } from '../core'
import { Filter, Sort } from '@/utils/filter-sort'

export async function getAdsSearchTerms({ filters, sorts, startDate, endDate, limit, page }) {
  return call('amazon/ads/search-terms', {
    method: 'POST',
    body: {
      filter: Filter.toAPI(filters),
      sort: Sort.toAPI(sorts),
      startDate,
      endDate,
      limit,
      page
    }
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
