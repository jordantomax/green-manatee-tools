import { renderHook, act } from '@testing-library/react'
import usePersistentState from './usePersistentState'

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist state across hook instances', () => {
    const { result: result1 } = renderHook(() => 
      usePersistentState('test-key', { count: 0 })
    )
    
    act(() => {
      result1.current[1]({ count: 5 })
    })
    
    // Unmount and remount
    result1.current = null
    
    const { result: result2 } = renderHook(() => 
      usePersistentState('test-key', { count: 0 })
    )
    
    expect(result2.current[0]).toEqual({ count: 5 })
  })
})
