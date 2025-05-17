import {
  setLocalData,
  getLocalData,
  removeLocalData
} from './storage'

const TOKEN_KEY = 'tokens'

export const getSavedTokens = async () => {
  return getLocalData(TOKEN_KEY) || {}
}

export const setSavedTokens = (tokens) => {
  setLocalData(TOKEN_KEY, tokens)
}

export const removeSavedTokens = () => {
  removeLocalData(TOKEN_KEY)
}
