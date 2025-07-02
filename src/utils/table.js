export const baseTypes = {
  id: {
    conditions: ['equals'],
    defaultCondition: 'equals',
    defaultValue: ''
  },
  string: {
    conditions: ['equals', 'contains'],
    defaultCondition: 'equals',
    defaultValue: ''
  },
  number: {
    conditions: ['equals', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'equals',
    defaultValue: 0
  },
  date: {
    conditions: ['equals', 'gt', 'gte', 'lt', 'lte', 'between'],
    defaultCondition: 'equals',
    defaultValue: ''
  },
  boolean: {
    conditions: ['equals'],
    defaultCondition: 'equals',
    defaultValue: false
  }
}

export const columnTypes = {
  // Date and identifiers
  date: 'date',
  campaignName: 'string',
  campaignId: 'id',
  adGroupName: 'string',
  adGroupId: 'id',
  portfolioId: 'id',
  
  // Campaign details
  campaignBudgetType: 'string',
  campaignBudgetAmount: 'number',
  campaignStatus: 'string',
  campaignBudgetCurrencyCode: 'string',
  
  // Basic metrics
  impressions: 'number',
  clicks: 'number',
  cost: 'number',
  costPerClick: 'number',
  clickThroughRate: 'number',
  
  // Purchase metrics
  purchases7D: 'number',
  purchases14D: 'number',
  purchasesSameSku7D: 'number',
  purchasesSameSku14D: 'number',
  
  // Sales metrics
  sales7D: 'number',
  sales14D: 'number',
  salesOtherSku7D: 'number',
  salesOtherSku14D: 'number',
  
  // Units sold metrics
  unitsSoldClicks7D: 'number',
  unitsSoldClicks14D: 'number',
  unitsSoldSameSku7D: 'number',
  unitsSoldSameSku14D: 'number',
  unitsSoldOtherSku7D: 'number',
  unitsSoldOtherSku14D: 'number',
  
  // Attribution metrics
  attributedSalesSameSku7D: 'number',
  attributedSalesSameSku14D: 'number',
  
  // Performance metrics
  acosClicks7D: 'number',
  acosClicks14D: 'number',
  roasClicks7D: 'number',
  roasClicks14D: 'number',
  purchaseClickRate14D: 'number',
  
  // Engagement metrics
  addToList: 'number',
  
  // Keyword metrics
  keywordId: 'id',
  keyword: 'string',
  keywordBid: 'number',
  keywordType: 'string',
  matchType: 'string',
  targeting: 'string',
  searchTerm: 'string',
  adKeywordStatus: 'string',
  topOfSearchImpressionShare: 'number',
  
  // Product metrics
  adId: 'id',
  spend: 'number',
  advertisedAsin: 'string',
  advertisedSku: 'string',
}

export const createDefaultFilter = (column) => {
  const baseTypeName = columnTypes[column] || 'string'
  const baseType = baseTypes[baseTypeName]
  return {
    column,
    type: baseTypeName,
    condition: baseType.defaultCondition,
    value: baseType.defaultValue,
  }
}