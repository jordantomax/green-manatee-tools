import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { KeywordStateSelect } from '../Keyword'
import api from '@/api'
import { TARGET_STATES } from '@/utils/constants'

vi.mock('@/api')

const mockRun = vi.fn().mockImplementation(async (apiCall) => {
  return await apiCall()
})

vi.mock('@/hooks/useAsync', () => ({
  useAsync: () => ({
    run: mockRun,
    isLoading: false,
    loadingStates: {}
  })
}))

vi.mock('@/hooks/useConfirm', () => ({
  useConfirm: () => vi.fn().mockResolvedValue(true)
}))

const setup = (props = {}) => {
  const defaultProps = {
    keywordId: 'test-keyword-id',
    value: TARGET_STATES.ENABLED,
    onChange: vi.fn(),
    isLoading: false,
    isNegative: false,
    ...props
  }
  
  // Mock API responses
  vi.mocked(api.archiveKeywords).mockResolvedValue({})
  vi.mocked(api.updateKeyword).mockResolvedValue({})
  vi.mocked(api.updateNegativeKeyword).mockResolvedValue({})
  
  renderWithProviders(<KeywordStateSelect {...defaultProps} />)
}

describe('KeywordStateSelect', () => {

  describe('handleStateChange', () => {

    describe('State is ARCHIVED', () => {
      it('Calls archiveKeywords with keywordId', async () => {
        const keywordId = 'test-keyword-id'
        setup({ keywordId })
        
        const select = screen.getByRole('textbox')
        fireEvent.click(select)
        
        const archivedOption = screen.getByText('Archived')
        fireEvent.click(archivedOption)
        
        await waitFor(() => {
          expect(api.archiveKeywords).toHaveBeenCalledWith([keywordId])
        })
      })
    })

    describe('State is not ARCHIVED', () => {
      it('Calls updateKeyword with state', async () => {
        const keywordId = 'test-keyword-id'
        setup({ keywordId })
        
        const select = screen.getByRole('textbox')
        fireEvent.click(select)
        
        const pausedOption = screen.getByText('Paused')
        fireEvent.click(pausedOption)
        
        await waitFor(() => {
          expect(api.updateKeyword).toHaveBeenCalledWith(keywordId, { state: TARGET_STATES.PAUSED })
        })
      })
    })
  })
})
