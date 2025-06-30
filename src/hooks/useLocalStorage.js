import { useState, useEffect } from 'react'
import { getLocalData, setLocalData } from '@/utils/storage'

export function useLocalStorage(key, defaultValues={}) {
  if (typeof defaultValues !== 'object' || defaultValues === null || Array.isArray(defaultValues)) {
    throw new Error('useLocalStorage: defaultValues must be a plain object')
  }

  const [values, setValues] = useState(defaultValues)
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

  const setValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  return [values, setValue]
}