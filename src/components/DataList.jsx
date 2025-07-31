import React from 'react'
import { SimpleGrid, Text } from '@mantine/core'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import startCase from 'lodash-es/startCase'
import get from 'lodash-es/get'

function DataList ({ data, visibleKeys=[] }) {
  const visibleData = Object.fromEntries(
    (visibleKeys.length > 0 ? visibleKeys : Object.keys(data))
      .map(item => {
        let key, label, prefix

        if (isString(item)) {
          key = item
          label = startCase(key)
          prefix = ''
        } else if (isObject(item)) {
          key = item.key
          label = item.label || startCase(key)
          prefix = item.prefix || ''
        }

        let value = get(data, key);
        if (isArray(value)) value = value.join(', ')
        if (prefix) value = `${prefix}${value}`;
        return [label, value];
      })
      .filter(([_, value]) => value !== undefined)
  )

  return (
    <SimpleGrid cols={2} spacing="xs" style={{ gridTemplateColumns: 'auto 1fr' }}>
      {Object.entries(visibleData).map(([label, value]) => {
        if (!label || !value) return null
        
        return (
          <React.Fragment key={label}>
            <Text size="sm" fw={600}>{label}:</Text>
            <Text size="sm">{Array.isArray(value) ? value.join(', ') : value}</Text>
          </React.Fragment>
        )
      })}
    </SimpleGrid>
  )
}

export default DataList
