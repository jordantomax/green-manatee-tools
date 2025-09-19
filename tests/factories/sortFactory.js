import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { columnTypes } from '../../src/utils/table'

export const sortFactory = Factory.define(({ sequence, transientParams }) => {
  const { column, direction, format = 'internal' } = transientParams
  
  // Get a random column if none specified
  const selectedColumn = column || faker.helpers.objectKey(columnTypes)
  const selectedDirection = direction || faker.helpers.arrayElement(['asc', 'desc'])
  
  if (format === 'api') {
    return {
      [selectedColumn]: selectedDirection
    }
  }
  
  return {
    id: faker.string.uuid(),
    column: selectedColumn,
    direction: selectedDirection,
  }
})
