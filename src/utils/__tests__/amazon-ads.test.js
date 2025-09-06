import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { findActiveNegativeKeyword } from '../amazon-ads'
import { TARGET_STATES } from '../constants'

describe('amazon-ads utils', () => {

  describe('findActiveNegativeKeyword', () => {

    describe('when keywordText and adGroupId match', () => {
      it('returns the matching negative keyword', () => {
        const keywordText = faker.lorem.word()
        const adGroupId = faker.amazon.id()
        const record = { searchTerm: keywordText, adGroupId }
        const negativeKeywords = [{
          keywordText,
          adGroupId,
          state: TARGET_STATES.ENABLED,
          matchType: 'EXACT'
        }]

        const result = findActiveNegativeKeyword(negativeKeywords, record)

        expect(result).toEqual(negativeKeywords[0])
      })
    })

    describe('when keywordText matches but adGroupId does not', () => {
      it('returns undefined', () => {
        const keywordText = faker.lorem.word()
        const record = { searchTerm: keywordText, adGroupId: faker.amazon.id() }
        const negativeKeywords = [{
          keywordText,
          adGroupId: faker.amazon.id(),
          state: TARGET_STATES.ENABLED
        }]

        const result = findActiveNegativeKeyword(negativeKeywords, record)

        expect(result).toBeUndefined()
      })
    })

    describe('when keyword is archived', () => {
      it('returns undefined', () => {
        const keywordText = faker.lorem.word()
        const adGroupId = faker.amazon.id()
        const record = { searchTerm: keywordText, adGroupId }
        const negativeKeywords = [{
          keywordText,
          adGroupId,
          state: TARGET_STATES.ARCHIVED
        }]

        const result = findActiveNegativeKeyword(negativeKeywords, record)

        expect(result).toBeUndefined()
      })
    })

    describe('when negativeKeywords is null', () => {
      it('returns undefined', () => {
        const record = { searchTerm: faker.lorem.word(), adGroupId: faker.amazon.id() }
        const result = findActiveNegativeKeyword(null, record)

        expect(result).toBeUndefined()
      })
    })

    describe('when negativeKeywords is undefined', () => {
      it('returns undefined', () => {
        const record = { searchTerm: faker.lorem.word(), adGroupId: faker.amazon.id() }
        const result = findActiveNegativeKeyword(undefined, record)

        expect(result).toBeUndefined()
      })
    })
  })
})

