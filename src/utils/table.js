export const conditionLabels = {
  equals: 'Equals',
  contains: 'Contains',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  lt: 'Less than',
  lte: 'Less than or equal',
  between: 'Between'
}

export const baseTypes = {
  id: {
    conditionOptions: ['equals'],
    defaultCondition: 'equals',
    defaultValue: ''
  },
  string: {
    conditionOptions: ['equals', 'contains'],
    defaultCondition: 'equals',
    defaultValue: ''
  },
  number: {
    conditionOptions: ['equals', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'equals',
    defaultValue: 0
  },
  date: {
    conditionOptions: ['equals', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'equals',
    defaultValue: null
  },
  boolean: {
    conditionOptions: ['equals'],
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
    id: crypto.randomUUID(),
    type: baseTypeName,
    value: baseType.defaultValue,
    condition: baseType.defaultCondition,
    conditionOptions: baseType.conditionOptions,
  }
}