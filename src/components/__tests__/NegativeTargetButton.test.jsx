import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { faker } from '@faker-js/faker'
import NegativeTargetButton from '../NegativeTargetButton'
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
    asin: faker.amazon.asin(),
    setNegativeTargets: vi.fn(),
    ...props
  }
  
  renderWithProviders(<NegativeTargetButton {...defaultProps} />)
}

describe('NegativeTargetButton', () => {

  describe('No negative target exists', () => {
    it('renders add button', () => {
      setup()
      expect(screen.getByText('Add Negative Target')).toBeInTheDocument()
    })
  })

  describe('Negative target exists', () => {
    it('renders remove button', () => {
      setup({ negativeTarget: { targetId: '789' } })
      expect(screen.getByText('Remove Negative Target')).toBeInTheDocument()
    })
  })
})
