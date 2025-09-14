import { useState, useCallback, useMemo } from 'react'

export default function useAsync() {
  const [loadingStates, setLoadingStates] = useState({})

  const run = useCallback(async (asyncFunction, operationName = 'default') => {
    setLoadingStates(prev => ({ ...prev, [operationName]: true }))
    
    try {
      const result = await asyncFunction()
      return result
    } finally {
      setLoadingStates(prev => ({ ...prev, [operationName]: false }))
    }
  }, [])

  const isLoading = useMemo(() => loadingStates.default || false, [loadingStates.default])

  return {
    isLoading,
    run,
    loadingStates
  }
} 