import mapKeys from 'lodash/mapKeys'
import mapValues from 'lodash/mapValues'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import snakeCase from 'lodash/snakeCase'

function deepMap (mapper) {
  return function (obj, fn) {
    return mapper(mapValues(obj, function (val) {
      if (isPlainObject(val)) {
        return deepMap(mapper)(val, fn)
      } else if (isArray(val)) {
        return val.map(el => {
          return isPlainObject(el) ? deepMap(mapper)(el, fn) : el
        })
      } else {
        return val
      }
    }), fn)
  }
}

export function deepMapKeys (obj, map) {
  return deepMap(mapKeys)(obj, map)
}

export function deepMapValues (obj, map) {
  return deepMap(mapValues)(obj, map)
}

export function deepToSnakeCase (obj) {
  return deepMapKeys(obj, (value, key) => {
    return snakeCase(key).replace(/_(\d+)/g, '$1')
  })
}
