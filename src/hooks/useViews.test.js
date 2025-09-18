import { viewFactory } from '@tests/factories'

vi.mock('@/api', () => ({
  default: {
    listViews: vi.fn().mockResolvedValue([]),
    createView: vi.fn().mockResolvedValue(viewFactory.build()),
    updateView: vi.fn(),
    deleteView: vi.fn()
  }
}))

import { act, renderHook } from '@testing-library/react'
import { RECORD_TYPES } from '@/utils/constants'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useViews from './useViews'
import api from '@/api'

const setup = async () => {
  let result
  await act(async () => {
    result = renderHook(() => useViews('test-key', RECORD_TYPES.SEARCH_TERMS)).result
  })
  return result
}

describe('useViews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns views', async () => {
    const result = await setup()
    expect(result.current).toHaveProperty('views')
  })
  
  describe('Filters change', () => {

    describe('With no active view', () => {

      it('Does not update view', async () => {
        const result = await setup()

        await act(async () => result.current.filterHandlers.add('test'))

        expect(api.updateView).not.toHaveBeenCalled()
      })
    })

    describe('With active view', () => {

      it('Updates view', async () => {
        const result = await setup()

        await act(async () => result.current.viewHandlers.create())
        await act(async () => result.current.filterHandlers.add('test'))

        expect(api.updateView).toHaveBeenCalled()
      })
    })
  })
})
