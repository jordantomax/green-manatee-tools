import { TARGET_STATES } from './constants'

export const getEntityType = (matchType) => {
  return matchType === 'TARGETING_EXPRESSION' ? 'target' : 'keyword'
}

export const findActiveNegativeKeyword = (negativeKeywords, keywordText, campaignId) => {
  return negativeKeywords?.find(k => (
    k.keywordText === keywordText && 
    k.campaignId === campaignId &&
    k.state !== TARGET_STATES.ARCHIVED
  ))
}