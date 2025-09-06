import { TARGET_STATES } from './constants'

export const getEntityType = (matchType) => {
  return matchType === 'TARGETING_EXPRESSION' ? 'target' : 'keyword'
}

export const findActiveNegativeKeyword = (negativeKeywords, record) => {
  return negativeKeywords?.find(k => (
    k.keywordText === record.searchTerm && 
    k.adGroupId === record.adGroupId &&
    k.state !== TARGET_STATES.ARCHIVED
  ))
}