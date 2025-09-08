import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { faker } from '@faker-js/faker'
import SearchTermColumn from '../SearchTermColumn'
import { TARGET_STATES } from '@/utils/constants'

const setup = (props = {}) => {
  const defaultProps = {
    row: {
      searchTerm: faker.lorem.word(),
      campaignId: faker.amazon.id()
    },
    negativeKeywords: [],
    negativeTargets: [],
    ...props
  }
  
  renderWithProviders(<SearchTermColumn {...defaultProps} />)
}

describe('SearchTermColumn', () => {

  describe('when keywordText matches searchTerm', () => {
    it('outputs negative keyword mark', () => {
      const searchTerm = faker.lorem.word()
      const campaignId = faker.amazon.id()
      
      setup({
        row: { searchTerm, campaignId },
        negativeKeywords: [{
          keywordText: searchTerm,
          campaignId,
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.getByTitle('Negative Keyword')).toBeInTheDocument()
    })
  })

  describe('when campaignIds do not match', () => {
    it('does not output negative keyword', () => {
      const searchTerm = faker.lorem.word()
      
      setup({
        row: { searchTerm, campaignId: faker.amazon.id() },
        negativeKeywords: [{
          keywordText: searchTerm,
          campaignId: faker.amazon.id(),
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.queryByTitle('Negative Keyword')).not.toBeInTheDocument()
    })
  })

  describe('when expression is lowercase', () => {
    it('outputs negative target mark', () => {
      const searchTerm = faker.lorem.word().toUpperCase()
      const campaignId = faker.amazon.id()
      
      setup({
        row: { searchTerm, campaignId },
        negativeTargets: [{
          expression: [{ value: searchTerm.toLowerCase() }],
          campaignId,
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.getByTitle('Negative Target')).toBeInTheDocument()
    })
  })

  describe('when row.searchTerm is lowercase', () => {
    it('outputs negative target mark', () => {
      const searchTerm = faker.lorem.word().toLowerCase()
      const campaignId = faker.amazon.id()
      
      setup({
        row: { searchTerm, campaignId },
        negativeTargets: [{
          expression: [{ value: searchTerm.toUpperCase() }],
          campaignId,
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.getByTitle('Negative Target')).toBeInTheDocument()
    })
  })

  describe('when campaignIds do not match for targets', () => {
    it('does not output negative target', () => {
      const searchTerm = faker.lorem.word()
      
      setup({
        row: { searchTerm, campaignId: faker.amazon.id() },
        negativeTargets: [{
          expression: [{ value: searchTerm }],
          campaignId: faker.amazon.id(),
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.queryByTitle('Negative Target')).not.toBeInTheDocument()
    })
  })

  describe('when negativeKeywords is null', () => {
    it('still renders search term text', () => {
      const searchTerm = faker.lorem.word()
      
      setup({
        row: { searchTerm, campaignId: faker.amazon.id() },
        negativeKeywords: null,
        negativeTargets: []
      })
      
      expect(screen.getByText(searchTerm)).toBeInTheDocument()
    })
  })

  describe('when negativeTargets is null', () => {
    it('still renders search term text', () => {
      const searchTerm = faker.lorem.word()
      
      setup({
        row: { searchTerm, campaignId: faker.amazon.id() },
        negativeKeywords: [],
        negativeTargets: null
      })
      
      expect(screen.getByText(searchTerm)).toBeInTheDocument()
    })
  })
})
