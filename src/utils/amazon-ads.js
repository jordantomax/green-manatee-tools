export const getEntityType = (matchType) => {
  return matchType === 'TARGETING_EXPRESSION' ? 'target' : 'keyword'
}