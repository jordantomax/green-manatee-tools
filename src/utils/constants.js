export const SEARCH_TERMS_HIDDEN_COLUMNS = [
  'keywordId',
  'campaignId',
  'adGroupId',
  'adId',
  'portfolioId',
  'campaignBudgetType',
  'campaignStatus',
  'campaignBudgetCurrencyCode',
  'adKeywordStatus',
  'date',
  'createdAt',
  'updatedAt',
]

export const MATCH_TYPES = {
  EXACT: 'EXACT',
  PHRASE: 'PHRASE', 
  BROAD: 'BROAD'
}

export const TARGET_STATES = {
  ARCHIVED: 'ARCHIVED',
  PAUSED: 'PAUSED',
  ENABLED: 'ENABLED',
  PENDING: 'PENDING',
}

export const NEGATIVE_TARGET_EXPRESSION_TYPES = {
  ASIN_SAME_AS: 'ASIN_SAME_AS',
  ASIN_BRAND_SAME_AS: 'ASIN_BRAND_SAME_AS'
}

export const RECORD_TYPES = {
  SEARCH_TERMS: 'search_terms'
}