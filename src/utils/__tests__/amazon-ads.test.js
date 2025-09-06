import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { findActiveNegativeKeyword } from '../amazon-ads'
import { TARGET_STATES } from '../constants'

describe('amazon-ads utils', () => {

  describe('findActiveNegativeKeyword', () => {

    describe('when keywordText and campaignId match', () => {
      it('returns the matching negative keyword', () => {
        const keywordText = faker.lorem.word()
        const campaignId = faker.amazon.id()
        const negativeKeywords = [{
          keywordText,
          campaignId,
          state: TARGET_STATES.ENABLED,
          matchType: 'EXACT'
        }]

        const result = findActiveNegativeKeyword(negativeKeywords, keywordText, campaignId)

        expect(result).toEqual(negativeKeywords[0])
      })
    })

    describe('when keywordText matches but campaignId does not', () => {
      it('returns undefined', () => {
        const keywordText = faker.lorem.word()
        const campaignId = faker.amazon.id()
        const negativeKeywords = [{
          keywordText,
          campaignId: faker.amazon.id(),
          state: TARGET_STATES.ENABLED
        }]

        const result = findActiveNegativeKeyword(negativeKeywords, keywordText, campaignId)

        expect(result).toBeUndefined()
      })
    })

    describe('when keyword is archived', () => {
      it('returns undefined', () => {
        const keywordText = faker.lorem.word()
        const campaignId = faker.amazon.id()
        const negativeKeywords = [{
          keywordText,
          campaignId,
          state: TARGET_STATES.ARCHIVED
        }]

        const result = findActiveNegativeKeyword(negativeKeywords, keywordText, campaignId)

        expect(result).toBeUndefined()
      })
    })

    describe('when negativeKeywords is null', () => {
      it('returns undefined', () => {
        const result = findActiveNegativeKeyword(null, faker.lorem.word(), faker.amazon.id())

        expect(result).toBeUndefined()
      })
    })

    describe('when negativeKeywords is undefined', () => {
      it('returns undefined', () => {
        const result = findActiveNegativeKeyword(undefined, faker.lorem.word(), faker.amazon.id())

        expect(result).toBeUndefined()
      })
    })
  })
})

