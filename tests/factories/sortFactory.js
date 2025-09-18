import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { columnTypes } from '../../src/utils/table'

export const sortFactory = Factory.define(({ sequence, transientParams }) => {
  const { column, direction } = transientParams
  
  // Get a random column if none specified
  const selectedColumn = column || faker.helpers.objectKey(columnTypes)
  
  return {
    id: faker.string.uuid(),
    column: selectedColumn,
    direction: direction || faker.helpers.arrayElement(['asc', 'desc']),
  }
})
