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
  },

  fromAPI(apiFilter) {
    if (!apiFilter?.and || !Array.isArray(apiFilter.and)) return []
    
    return apiFilter.and.map(filterObj => {
      const column = Object.keys(filterObj)[0]
      const conditionObj = filterObj[column]
      const condition = Object.keys(conditionObj)[0]
      const value = conditionObj[condition]
      
      return {
        column,
        condition,
        value,
        id: crypto.randomUUID(),
        type: columnTypes[column] || 'string',
        conditionOptions: primitiveTypes[columnTypes[column] || 'string']?.conditionOptions || []
      }
    })
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
  },

  fromAPI(apiSort) {
    if (!apiSort || !Array.isArray(apiSort)) return []
    
    return apiSort.map(sortObj => {
      const column = Object.keys(sortObj)[0]
      const direction = sortObj[column]
      
      return {
        column,
        direction,
        id: crypto.randomUUID()
      }
    })
  }
}

export { Filter, Sort }
