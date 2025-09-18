import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useViews from './useViews'

vi.mock('@/api', () => ({
  default: {
    listViews: vi.fn().mockResolvedValue([]),
    createView: vi.fn(),
    updateView: vi.fn(),
    deleteView: vi.fn()
  }
}))

vi.mock('@/hooks/usePersistentState', () => ({
  default: (key, defaultValue) => [defaultValue, vi.fn()]
}))

describe('useViews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns expected structure', () => {
    const { result } = renderHook(() => useViews('test-key', 'search-terms'))
    
    expect(result.current).toHaveProperty('views')
  })
})
