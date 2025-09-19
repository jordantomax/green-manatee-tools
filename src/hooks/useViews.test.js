import { viewFactory, filterFactory, sortFactory } from '@tests/factories'

vi.mock('@/api', () => ({
  default: {
    listViews: vi.fn(),
    createView: vi.fn(),
    updateView: vi.fn(),
    deleteView: vi.fn()
  }
}))

import { act, renderHook } from '@testing-library/react'
import { RECORD_TYPES } from '@/utils/constants'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useViews from './useViews'
import api from '@/api'

describe('useViews', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    api.listViews.mockResolvedValue([])
    api.createView.mockResolvedValue(viewFactory.build())
  })

  const render = async (callbacks) => {
    let ref = null
    await act(async () => {
      ref = renderHook(() => useViews('test-key', RECORD_TYPES.SEARCH_TERMS, callbacks)).result
    })
    return ref
  }

  it('returns views', async () => {
    const ref = await render()
    expect(ref.current).toHaveProperty('views')
  })
  
  describe('Filters change', () => {

    describe('With no active view', () => {

      it('Does not update view', async () => {
        const ref = await render()

        await act(async () => ref.current.filterHandlers.add('test'))

        expect(api.updateView).not.toHaveBeenCalled()
      })
    })

    describe('With active view', () => {

      it('Updates view', async () => {
        const ref = await render()

        await act(async () => ref.current.viewHandlers.create())
        await act(async () => ref.current.filterHandlers.add('test'))

        expect(api.updateView).toHaveBeenCalled()
      })
    })
  })

  describe('Active view changes', () => {
    const setup = async ({ callback, view1, view2 }) => {

      api.listViews.mockResolvedValue([view1, view2])
      
      const callbacks = { onActiveViewChange: callback }
      const ref = await render(callbacks)
      
      callback.mockClear()

      return ref
    }

    it('calls onActiveViewChange callback with new view', async () => {
      const callback = vi.fn()
      const view1 = viewFactory.build()
      const view2 = viewFactory.build()
      const ref = await setup({ callback, view1, view2 })

      await act(async () => ref.current.viewHandlers.setActive(view2.id))

      expect(callback.mock.calls[0][0].id === view2.id)
    })

    it('calls onActiveViewChange callback with new view filters', async () => {
      const callback = vi.fn()
      const view1 = viewFactory.build()
      const view2 = viewFactory.build({}, { transient: { withFilters: true } })
      await setup({ callback, view1, view2 })
      const ref = await setup({ callback, view1, view2 })

      await act(async () => ref.current.viewHandlers.setActive(view2.id))

      expect(callback.mock.calls[0][0].filter).toEqual(view2.filter)
    })

    it('calls onActiveViewChange callback with new view sorts', async () => {
      const callback = vi.fn()
      const view1 = viewFactory.build()
      const view2 = viewFactory.build({}, { transient: { withSorts: true } })
      const ref = await setup({ callback, view1, view2 })

      await act(async () => ref.current.viewHandlers.setActive(view2.id))

      expect(callback.mock.calls[0][0].sort).toEqual(view2.sort)
    })
  })

  describe('Create', () => {

    describe('No existing views', () => {
      
       it('Creates with current filters and sorts', async () => {
         const ref = await render()

         await act(async () => ref.current.filterHandlers.add('testColumn'))
         await act(async () => ref.current.sortHandlers.add('testColumn'))
         
         const currentFilters = ref.current.filters
         const currentSorts = ref.current.sorts
         
         await act(async () => ref.current.viewHandlers.create())

         expect(api.createView).toHaveBeenCalledWith(
           expect.objectContaining({
             filters: currentFilters,
             sorts: currentSorts
           })
         )
       })
    })

    describe('With existing views', () => {

      it('does not pass filters and sorts to createView', async () => {
        api.listViews.mockResolvedValue([viewFactory.build()])

        const ref = await render()
        
        await act(async () => ref.current.filterHandlers.add('testColumn'))
        await act(async () => ref.current.sortHandlers.add('testColumn'))
        await act(async () => ref.current.viewHandlers.create())
        
         expect(api.createView).toHaveBeenCalledWith(
           expect.objectContaining({
             filters: null,
             sorts: null
           })
         )
      })
    })
  })
})