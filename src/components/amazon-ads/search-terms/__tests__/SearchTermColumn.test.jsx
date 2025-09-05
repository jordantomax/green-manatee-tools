import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { faker } from '@faker-js/faker'
import SearchTermColumn from '../SearchTermColumn'
import { TARGET_STATES } from '@/utils/constants'

const setup = (props = {}) => {
  const defaultProps = {
    row: {
      searchTerm: faker.lorem.word(),
      adGroupId: faker.amazon.id()
    },
    negativeKeywords: [],
    negativeTargets: [],
    ...props
  }
  
  render(
    <MantineProvider>
      <SearchTermColumn {...defaultProps} />
    </MantineProvider>
  )
}

describe('SearchTermColumn', () => {

  describe('when keywordText matches searchTerm', () => {
    it('outputs negative keyword mark', () => {
      const searchTerm = faker.lorem.word()
      const adGroupId = faker.amazon.id()
      
      setup({
        row: { searchTerm, adGroupId },
        negativeKeywords: [{
          keywordText: searchTerm,
          adGroupId,
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.getByTitle('Negative Keyword')).toBeInTheDocument()
    })
  })

  describe('when adGroupIds do not match', () => {
    it('does not output negative keyword', () => {
      const searchTerm = faker.lorem.word()
      
      setup({
        row: { searchTerm, adGroupId: faker.amazon.id() },
        negativeKeywords: [{
          keywordText: searchTerm,
          adGroupId: faker.amazon.id(),
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.queryByTitle('Negative Keyword')).not.toBeInTheDocument()
    })
  })

  describe('when expression is lowercase', () => {
    it('outputs negative target mark', () => {
      const searchTerm = faker.lorem.word().toUpperCase()
      const adGroupId = faker.amazon.id()
      
      setup({
        row: { searchTerm, adGroupId },
        negativeTargets: [{
          expression: [{ value: searchTerm.toLowerCase() }],
          adGroupId,
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.getByTitle('Negative Target')).toBeInTheDocument()
    })
  })

  describe('when row.searchTerm is lowercase', () => {
    it('outputs negative target mark', () => {
      const searchTerm = faker.lorem.word().toLowerCase()
      const adGroupId = faker.amazon.id()
      
      setup({
        row: { searchTerm, adGroupId },
        negativeTargets: [{
          expression: [{ value: searchTerm.toUpperCase() }],
          adGroupId,
          state: TARGET_STATES.ENABLED
        }]
      })
      
      expect(screen.getByTitle('Negative Target')).toBeInTheDocument()
    })
  })

  describe('when adGroupIds do not match for targets', () => {
    it('does not output negative target', () => {
      const searchTerm = faker.lorem.word()
      
      setup({
        row: { searchTerm, adGroupId: faker.amazon.id() },
        negativeTargets: [{
          expression: [{ value: searchTerm }],
          adGroupId: faker.amazon.id(),
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
        row: { searchTerm, adGroupId: faker.amazon.id() },
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
        row: { searchTerm, adGroupId: faker.amazon.id() },
        negativeKeywords: [],
        negativeTargets: null
      })
      
      expect(screen.getByText(searchTerm)).toBeInTheDocument()
    })
  })
})
