import { useState, useEffect } from 'react'
import { getLocalData, setLocalData } from '@/utils/storage'

export function useLocalStorage(key, defaultValue={}) {
  if (typeof defaultValue !== 'object' || defaultValue === null || Array.isArray(defaultValue)) {
    throw new Error('useLocalStorage: defaultValue must be a plain object')
  }

  const [values, setValues] = useState(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedValue = getLocalData(key)
    if (savedValue) {
      setValues(prev => ({ ...prev, ...savedValue }))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      setLocalData(key, values)
    }
  }, [key, values, isLoaded])

  const setField = (field, fieldValue) => {
    setValues(prev => ({ ...prev, [field]: fieldValue }))
  }

  return [values, setField]
}