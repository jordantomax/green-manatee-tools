import toLower from 'lodash-es/toLower'
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

export const findActiveNegativeTarget = (negativeTargets, expressionValue, campaignId) => {
  return negativeTargets?.find(t => (
    toLower(t.expression?.[0]?.value) === toLower(expressionValue) && 
    (campaignId ? t.campaignId === campaignId : true) &&
    t.state !== TARGET_STATES.ARCHIVED
  ))
}