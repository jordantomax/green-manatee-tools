import { useState, useEffect } from 'react'
import { getLocalData, setLocalData } from '@/utils/storage'

const PERSISTENT_STATE_KEY = 'persistentState'

export default function usePersistentState(key, defaultValues = {}) {
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

  return [values, setValues]
}