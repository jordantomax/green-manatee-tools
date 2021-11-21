import {
  setLocalData,
  getLocalData,
  removeLocalData
} from './storage'

export const getSavedTokens = async () => {
  return getLocalData('tokens')
}

export const setSavedTokens = (tokens) => {
  setLocalData('tokens', tokens)
}

export const removeSavedTokens = (tokens) => {
  removeLocalData('tokens')
}
