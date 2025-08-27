import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { faker } from '@faker-js/faker'
import Keyword from '../Keyword'
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

const setup = (props = {}) => {
  const defaultProps = {
    searchTerm: faker.lorem.word(),
    keywordId: faker.amazon.id(),
    recordsAggregate: {
      campaignId: faker.amazon.id(),
      adGroupId: faker.amazon.id(),
      campaignName: faker.lorem.words(2),
      adGroupName: faker.lorem.words(2)
    },
    ...props
  }
  
  // Mock API responses
  vi.mocked(api.getKeywordById).mockResolvedValue({ state: 'ENABLED' })
  vi.mocked(api.listNegativeKeywords).mockResolvedValue(props.negativeKeywords || [])
  
  render(
    <MantineProvider>
      <BrowserRouter>
        <Keyword {...defaultProps} />
      </BrowserRouter>
    </MantineProvider>
  )
}

describe('Keyword view', () => {

  describe('activeNegativeKeyword', () => {

    describe('keywordText matches, state not archived', () => {
      it('finds active negative keyword', async () => {
        const searchTerm = faker.lorem.word()
        const negativeKeywords = [{
          keywordText: searchTerm,
          matchType: 'EXACT',
          state: TARGET_STATES.ENABLED
        }]
        
        setup({ searchTerm, negativeKeywords })
        
        await waitFor(() => {
          expect(screen.getByText('EXACT')).toBeInTheDocument()
        })
      })
    })
    
    describe('keywordText matches, state archived', () => {
      it('does not find active negative keyword', async () => {
        const searchTerm = faker.lorem.word()
        const negativeKeywords = [{
          keywordText: searchTerm,
          matchType: 'EXACT',
          state: TARGET_STATES.ARCHIVED
        }]
        
        setup({ searchTerm, negativeKeywords })
        
        await waitFor(() => {
          expect(screen.queryByText('EXACT')).not.toBeInTheDocument()
        })
      })
    })
  })
})
