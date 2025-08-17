import React from 'react'
import { SimpleGrid, Text, Anchor, Badge } from '@mantine/core'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import startCase from 'lodash-es/startCase'
import get from 'lodash-es/get'

import styles from '@/styles/DataList.module.css'

function DataList ({ data, keys=[] }) {
  const visibleData = (keys.length > 0 ? keys : Object.keys(data))
    .map(item => {
      let key, label, prefix = '', url = '', badge = false, component = null

      if (isString(item)) {
        key = item
        label = startCase(key)
      } else if (isObject(item)) {
        key = item.key
        label = item.label || startCase(key)
        url = item.url || ''
        prefix = item.prefix || ''
        badge = item.badge || false
        component = item.component || null
      }
      

      let value = get(data, key);
      if (isArray(value)) value = value.join(', ')
      if (prefix) value = `${prefix}${value}`;
      return { key, label, value, url, badge, component }
    })
    .filter(({ value }) => value !== undefined)

  return (
    <SimpleGrid className={styles.datalist} cols={2} spacing="xs">
      {visibleData.map(({ key, label, value, url, badge, component: CustomComponent }) => {
        if (!label || !value) return null
        
        return (
          <React.Fragment key={label}>
            <Text size="sm" fw={600}>{label}:</Text>

            {
              CustomComponent ? <CustomComponent value={value} data={data} keyName={key} /> : 
              badge ? <Badge variant="default" size="sm">{value}</Badge> : 
              <Text size="sm">
                {url ? <Anchor href={url}>{value}</Anchor> : value}
              </Text>
            }
          </React.Fragment>
        )
      })}
    </SimpleGrid>
  )
}

export default DataList
