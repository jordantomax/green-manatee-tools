import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { columnTypes, primitiveTypes } from '../../src/utils/table'

export const filterFactory = Factory.define(({ sequence, transientParams }) => {
  const { column, format = 'internal' } = transientParams
  
  const selectedColumn = column || faker.helpers.objectKey(columnTypes)
  const columnType = columnTypes[selectedColumn] || 'string'
  const primitive = primitiveTypes[columnType]
  const condition = faker.helpers.arrayElement(primitive.conditionOptions)
  const value = primitive.defaultValue
  
  if (format === 'api') {
    return {
      [selectedColumn]: {
        [condition]: value
      }
    }
  }
  
  return {
    id: faker.string.uuid(),
    column: selectedColumn,
    type: columnType,
    condition,
    value,
    conditionOptions: primitive.conditionOptions,
  }
})
