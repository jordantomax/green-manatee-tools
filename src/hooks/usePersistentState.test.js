import { renderHook, act } from '@testing-library/react'
import usePersistentState from './usePersistentState'

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists state across hook instances', () => {
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

  it('persists falsy values', () => {
    const { result: result1 } = renderHook(() => 
      usePersistentState('test-array', [1, 2, 3])
    )
    
    act(() => {
      result1.current[1]([])
    })
    
    // Unmount and remount
    result1.current = null
    
    const { result: result2 } = renderHook(() => 
      usePersistentState('test-array', [1, 2, 3])
    )
    
    expect(result2.current[0]).toEqual([])
  })
})
