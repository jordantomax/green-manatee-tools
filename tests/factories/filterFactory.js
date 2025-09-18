import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { columnTypes, primitiveTypes } from '../../src/utils/table'

export const filterFactory = Factory.define(({ sequence, transientParams }) => {
  const { column } = transientParams
  
  const selectedColumn = column || faker.helpers.objectKey(columnTypes)
  const columnType = columnTypes[selectedColumn] || 'string'
  const primitive = primitiveTypes[columnType]
  
  return {
    id: faker.string.uuid(),
    column: selectedColumn,
    type: columnType,
    condition: faker.helpers.arrayElement(primitive.conditionOptions),
    value: primitive.defaultValue,
    conditionOptions: primitive.conditionOptions,
  }
})
