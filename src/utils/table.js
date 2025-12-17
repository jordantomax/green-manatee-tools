export const orderColumns = (columns, order) => {
  if (order && Array.isArray(order)) {
    const orderedColumns = order.filter(col => columns.includes(col))
    const remainingColumns = columns.filter(col => !order.includes(col))
    return [...orderedColumns, ...remainingColumns]
  }
  return columns
}

export const conditionLabels = {
  eq: 'Equals',
  ne: 'Does not equal',
  contains: 'Contains',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  lt: 'Less than',
  lte: 'Less than or equal',
  between: 'Between'
}

export const primitiveTypes = {
  id: {
    conditionOptions: ['eq', 'ne'],
    defaultCondition: 'eq',
    defaultValue: ''
  },
  string: {
    conditionOptions: ['eq', 'ne', 'contains'],
    defaultCondition: 'eq',
    defaultValue: ''
  },
  integer: {
    conditionOptions: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: 0
  },
  float: {
    conditionOptions: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: 0.00
  },
  currency: {
    conditionOptions: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: 0.00
  },
  date: {
    conditionOptions: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
    defaultCondition: 'eq',
    defaultValue: null
  },
  boolean: {
    conditionOptions: ['eq', 'ne'],
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
  purchases7d: 'integer',
  // purchases14d: 'integer',
  purchasesSameSku7d: 'integer',
  // purchasesSameSku14d: 'integer',
  
  // Sales metrics
  sales7d: 'integer',
  // sales14d: 'integer',
  salesOtherSku7d: 'integer',
  // salesOtherSku14d: 'integer',
  
  // Units sold metrics
  unitsSoldClicks7d: 'integer',
  // unitsSoldClicks14d: 'integer',
  unitsSoldSameSku7d: 'integer',
  // unitsSoldSameSku14d: 'integer',
  unitsSoldOtherSku7d: 'integer',
  // unitsSoldOtherSku14d: 'integer',
  
  // Attribution metrics
  attributedSalesSameSku7d: 'currency',
  // attributedSalesSameSku14d: 'currency',
  
  // Performance metrics
  acosClicks7d: 'float',
  // acosClicks14d: 'float',
  roasClicks7d: 'float',
  // roasClicks14d: 'float',
  purchaseClickRate14d: 'float',
  
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
).sort()


export const sortDirections = {
  asc: 'asc',
  desc: 'desc'
}

export const getSortableColumns = () => {
  return Object.keys(columnTypes).filter(key => 
    !['id', 'boolean'].includes(columnTypes[key])
  ).sort()
}