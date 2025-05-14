import { useState, useCallback } from 'react'

export function useAsync() {
  const [isLoading, setIsLoading] = useState(false)

  const run = useCallback(async (asyncFunction) => {
    setIsLoading(true)
    const result = await asyncFunction()
    setIsLoading(false)
    return result
  }, [])

  return {
    isLoading,
    run
  }
} 