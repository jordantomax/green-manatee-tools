import { useState, useCallback } from 'react'

export function useAsync() {
  const [isLoading, setIsLoading] = useState(false)

  const run = useCallback(async (asyncFunction) => {
    setIsLoading(true)
    try {
      const result = await asyncFunction()
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    run
  }
} 