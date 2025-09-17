import { useState, useEffect } from 'react'
import { getLocalData, setLocalData } from '@/utils/storage'

const PERSISTENT_STATE_KEY = 'persistentState'

export default function usePersistentState(key, defaultValues = {}) {
  if (typeof defaultValues !== 'object' || defaultValues === null || Array.isArray(defaultValues)) {
    throw new Error('usePersistentState: defaultValues must be a plain object')
  }

  const [values, setValues] = useState(() => {
    const persistentState = getLocalData(PERSISTENT_STATE_KEY) || {}
    const saved = persistentState[key]
    return saved ? { ...defaultValues, ...saved } : defaultValues
  })

  useEffect(() => {
    const persistentState = getLocalData(PERSISTENT_STATE_KEY) || {}
    persistentState[key] = values
    setLocalData(PERSISTENT_STATE_KEY, persistentState)
  }, [key, values])

  const setValue = (fieldOrObject, value) => {
    if (fieldOrObject && typeof fieldOrObject === 'object') {
      setValues(fieldOrObject)
    } else {
      setValues(prev => ({ ...prev, [fieldOrObject]: value }))
    }
  }

  return [values, setValue]
}