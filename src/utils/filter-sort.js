import { columnTypes, primitiveTypes } from './table.js'

const Filter = {
  create(column) {
    const primitiveName = columnTypes[column] || 'string'
    const primitive = primitiveTypes[primitiveName]
    return {
      column,
      id: crypto.randomUUID(),
      type: primitiveName,
      value: primitive.defaultValue,
      condition: primitive.defaultCondition,
      conditionOptions: primitive.conditionOptions,
    }
  },
  
  toAPI(filters) {
    if (!filters?.length) return null
    return { and: filters.map(f => {
      if (!f?.column || !f?.condition || f.value === undefined) {
        throw new Error('Filter requires column, condition, and value')
      }
      return { [f.column]: { [f.condition]: f.value } }
    }) }
  }
}

const Sort = {
  create(column) {
    return {
      column,
      id: crypto.randomUUID(),
      direction: 'desc'
    }
  },
  
  toAPI(sorts) {
    if (!sorts?.length) return null
    return sorts.map(s => {
      if (!s?.column || !s?.direction || !['asc', 'desc'].includes(s.direction)) {
        throw new Error('Sort requires column and valid direction')
      }
      return { [s.column]: s.direction }
    })
  }
}

export { Filter, Sort }
