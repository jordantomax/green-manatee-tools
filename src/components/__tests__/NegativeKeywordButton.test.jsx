import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { faker } from '@faker-js/faker'
import NegativeKeywordButton from '../NegativeKeywordButton'
import api from '@/api'

vi.mock('@/api')

const mockRun = vi.fn().mockImplementation(async (apiCall) => {
  return await apiCall()
})

vi.mock('@/hooks/useAsync', () => ({
  default: () => ({
    run: mockRun,
    isLoading: false
  })
}))

const setup = (props = {}) => {
  const defaultProps = {
    campaignId: faker.amazon.id(),
    adGroupId: faker.amazon.id(),
    keywordText: faker.lorem.word(),
    onSuccess: vi.fn(),
    ...props
  }
  
  renderWithProviders(<NegativeKeywordButton {...defaultProps} />)
}

describe('NegativeKeywordButton', () => {

  describe('No negative keyword exists', () => {
    it('renders add button', () => {
      setup()
      expect(screen.getByText('Add Negative Keyword')).toBeInTheDocument()
    })
  })

  describe('Negative keyword exists', () => {
    it('renders remove button', () => {
      setup({ negativeKeyword: { keywordId: '789' } })
      expect(screen.getByText('Remove Negative Keyword')).toBeInTheDocument()
    })
  })
})
