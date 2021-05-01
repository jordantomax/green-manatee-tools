import {
  setLocalData,
  getLocalData,
  removeLocalData
} from './storage'

export const getSavedToken = async () => {
  return getLocalData('token')
}

export const setSavedToken = (token) => {
  setLocalData('token', token)
}

export const removeSavedToken = (token) => {
  removeLocalData('token')
}
