import React from 'react'
import { SimpleGrid, Text, Anchor, Badge } from '@mantine/core'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import startCase from 'lodash-es/startCase'
import get from 'lodash-es/get'

import styles from '@/styles/DataList.module.css'

function DataListItem ({ label, value, url, badge, component: CustomComponent }) {
  if (!label || !value) return null

  return (
    <React.Fragment key={label}>
      <Text size="sm" fw={600}>{label}:</Text>

      {
        CustomComponent ? <CustomComponent value={value} /> : 
        badge ? <Badge variant="default" size="sm">{value}</Badge> : 
        <Text size="sm">
          {url ? <Anchor href={url}>{value}</Anchor> : value}
        </Text>
      }
    </React.Fragment>
  )
}

function DataList ({ data, keys=[] }) {
  const visibleData = (keys.length > 0 ? keys : Object.keys(data))
    .map(item => {
      const config = isString(item) ? { 
        key: item, 
        label: startCase(item) 
      } : { 
        key: item.key,
        label: item.label || startCase(item.key),
        url: item.url || '',
        prefix: item.prefix || '',
        badge: item.badge || false,
        component: item.component || null
      }

      let value = get(data, config.key);
      if (isArray(value)) value = value.join(', ')
      if (config.prefix) value = `${config.prefix}${value}`;
      return { ...config, value }
    })
    .filter(({ value }) => value !== undefined)

  return (
    <SimpleGrid className={styles.datalist} cols={2} spacing="xs">
      {visibleData.map(({ key, ...item }) => <DataListItem key={key} {...item} />)}
    </SimpleGrid>
  )
}

export default DataList
