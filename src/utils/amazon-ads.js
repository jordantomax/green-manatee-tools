import { TARGET_STATES } from './constants'

export const getEntityType = (matchType) => {
  return matchType === 'TARGETING_EXPRESSION' ? 'target' : 'keyword'
}

export const findActiveNegativeKeyword = (negativeKeywords, keywordText, adGroupId) => {
  return negativeKeywords?.find(k => (
    k.keywordText === keywordText && 
    k.adGroupId === adGroupId &&
    k.state !== TARGET_STATES.ARCHIVED
  ))
}