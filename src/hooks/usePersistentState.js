import { useState, useEffect } from 'react'
import { getLocalData, setLocalData } from '@/utils/storage'

export default function usePersistentState(key, defaultValues = {}) {
  if (typeof defaultValues !== 'object' || defaultValues === null || Array.isArray(defaultValues)) {
    throw new Error('usePersistentState: defaultValues must be a plain object')
  }

  const [values, setValues] = useState(() => {
    const saved = getLocalData(key)
    return saved ? { ...defaultValues, ...saved } : defaultValues
  })

  useEffect(() => {
    setLocalData(key, values)
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