export const conditionLabels = {
  eq: 'Equals',
  contains: 'Contains',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  lt: 'Less than',
  lte: 'Less than or equal',
  between: 'Between'
}

export const baseTypes = {
  id: {
    conditionOptions: ['eq'],
    defaultCondition: 'eq',
    defaultValue: ''
  },
  string: {
    conditionOptions: ['eq', 'contains'],
    defaultCondition: 'eq',
    defaultValue: ''
  },
  integer: {
    conditionOptions: ['eq', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: 0
  },
  float: {
    conditionOptions: ['eq', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: 0.00
  },
  currency: {
    conditionOptions: ['eq', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: 0.00
  },
  date: {
    conditionOptions: ['eq', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: null
  },
  boolean: {
    conditionOptions: ['eq'],
    defaultCondition: 'eq',
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
  campaignBudgetAmount: 'currency',
  campaignStatus: 'string',
  campaignBudgetCurrencyCode: 'string',
  
  // Basic metrics
  impressions: 'integer',
  clicks: 'integer',
  cost: 'currency',
  costPerClick: 'currency',
  clickThroughRate: 'float',
  
  // Purchase metrics
  purchases7D: 'integer',
  purchases14D: 'integer',
  purchasesSameSku7D: 'integer',
  purchasesSameSku14D: 'integer',
  
  // Sales metrics
  sales7D: 'integer',
  sales14D: 'integer',
  salesOtherSku7D: 'integer',
  salesOtherSku14D: 'integer',
  
  // Units sold metrics
  unitsSoldClicks7D: 'integer',
  unitsSoldClicks14D: 'integer',
  unitsSoldSameSku7D: 'integer',
  unitsSoldSameSku14D: 'integer',
  unitsSoldOtherSku7D: 'integer',
  unitsSoldOtherSku14D: 'integer',
  
  // Attribution metrics
  attributedSalesSameSku7D: 'currency',
  attributedSalesSameSku14D: 'currency',
  
  // Performance metrics
  acosClicks7D: 'float',
  acosClicks14D: 'float',
  roasClicks7D: 'float',
  roasClicks14D: 'float',
  purchaseClickRate14D: 'float',
  
  // Engagement metrics
  addToList: 'integer',
  
  // Keyword metrics
  keywordId: 'id',
  keyword: 'string',
  keywordBid: 'currency',
  keywordType: 'string',
  matchType: 'string',
  targeting: 'string',
  searchTerm: 'string',
  adKeywordStatus: 'string',
  topOfSearchImpressionShare: 'float',
  
  // Product metrics
  adId: 'id',
  spend: 'currency',
  advertisedAsin: 'string',
  advertisedSku: 'string',
}

export const numberTypeColumns = Object.keys(columnTypes).filter(key => 
  ['integer', 'float', 'currency'].includes(columnTypes[key])
)

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