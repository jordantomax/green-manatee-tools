import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { Filter, Sort } from '../filter-sort'
import { columnTypes } from '../table'

const getRandomColumn = () => faker.helpers.arrayElement(Object.keys(columnTypes))
const getColumnsByType = (type) => Object.keys(columnTypes).filter(key => columnTypes[key] === type)
const getRandomColumnOfType = (type) => faker.helpers.arrayElement(getColumnsByType(type))

describe('filter-sort utils', () => {

  describe('Filter', () => {

    describe('create', () => {
      it('sets the column name', () => {
        const column = getRandomColumn()
        const filter = Filter.create(column)

        expect(filter.column).toBe(column)
      })

      it('sets type to match column', () => {
        const column = getRandomColumnOfType('string')
        const filter = Filter.create(column)

        expect(filter.type).toBe('string')
      })
    })

    describe('toAPI', () => {
      it('wraps filters with and clause', () => {
        const column = getRandomColumn()
        const value = faker.lorem.word()
        const filters = [
          { column, condition: 'contains', value }
        ]

        const result = Filter.toAPI(filters)

        expect(result).toHaveProperty('and')
      })

      it('transforms single filter to API format', () => {
        const column = getRandomColumn()
        const value = faker.lorem.word()
        const filters = [
          { column, condition: 'contains', value }
        ]

        const result = Filter.toAPI(filters)

        expect(result.and[0]).toEqual({ [column]: { contains: value } })
      })

      it('transforms multiple filters to API format', () => {
        const column1 = getRandomColumn()
        const column2 = getRandomColumn()
        const value1 = faker.lorem.word()
        const value2 = faker.number.int()
        const filters = [
          { column: column1, condition: 'contains', value: value1 },
          { column: column2, condition: 'gt', value: value2 }
        ]

        const result = Filter.toAPI(filters)

        expect(result.and).toHaveLength(2)
      })

      it('returns null for empty array', () => {
        const result = Filter.toAPI([])

        expect(result).toBeNull()
      })

      it('throws error for filter missing column', () => {
        const value = faker.lorem.word()
        const filters = [{ condition: 'eq', value }]

        expect(() => Filter.toAPI(filters)).toThrow()
      })

      it('throws error for filter missing condition', () => {
        const column = getRandomColumn()
        const value = faker.lorem.word()
        const filters = [{ column, value }]

        expect(() => Filter.toAPI(filters)).toThrow()
      })

      it('throws error for filter missing value', () => {
        const column = getRandomColumn()
        const filters = [{ column, condition: 'eq' }]

        expect(() => Filter.toAPI(filters)).toThrow()
      })
    })
  })

  describe('Sort', () => {

    describe('create', () => {
      it('sets the column name', () => {
        const column = getRandomColumn()
        const sort = Sort.create(column)

        expect(sort.column).toBe(column)
      })

      it('sets default direction to desc', () => {
        const column = getRandomColumn()
        const sort = Sort.create(column)

        expect(sort.direction).toBe('desc')
      })
    })

    describe('toAPI', () => {
      it('transforms single sort to API format', () => {
        const column = getRandomColumn()
        const sorts = [
          { column, direction: 'desc' }
        ]

        const result = Sort.toAPI(sorts)

        expect(result[0]).toEqual({ [column]: 'desc' })
      })

      it('transforms multiple sorts to API format', () => {
        const column1 = getRandomColumn()
        const column2 = getRandomColumn()
        const sorts = [
          { column: column1, direction: 'desc' },
          { column: column2, direction: 'asc' }
        ]

        const result = Sort.toAPI(sorts)

        expect(result).toHaveLength(2)
      })

      it('returns null for empty array', () => {
        const result = Sort.toAPI([])

        expect(result).toBeNull()
      })

      it('throws error for sort missing column', () => {
        const sorts = [{ direction: 'asc' }]

        expect(() => Sort.toAPI(sorts)).toThrow()
      })

      it('throws error for sort missing direction', () => {
        const column = getRandomColumn()
        const sorts = [{ column }]

        expect(() => Sort.toAPI(sorts)).toThrow()
      })

      it('throws error for sort with invalid direction', () => {
        const column = getRandomColumn()
        const sorts = [{ column, direction: 'invalid' }]

        expect(() => Sort.toAPI(sorts)).toThrow()
      })
    })
  })
})
