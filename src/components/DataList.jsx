import React from 'react'
import isPlainObject from 'lodash-es/isPlainObject'
import isArray from 'lodash-es/isArray'
import { Grid, Text, Anchor } from '@mantine/core'
import startCase from 'lodash-es/startCase'

function DataList ({ obj, mask, imageMask, linkMask }) {
  return Object.entries(obj).map(([key, value], j) => {
    let isVisible = false
    if (
      (mask && mask.includes(key)) ||
      (imageMask && imageMask.includes(key)) ||
      (linkMask && linkMask.includes(key))
    ) isVisible = true
    if (!isVisible) return false

    function getMaskedString () {
      if (mask && mask.includes(key)) {
        if (isPlainObject(value)) {
          let displayedValue = ''
          for (const key in value) {
            if (mask.includes(key)) displayedValue += value[key]
          }
          return displayedValue
        } else if (isArray(value) && value.length > 0) {
          return value.reduce((prev, cur) => prev + ', ' + cur)
        } else {
          return value
        }
      }
    }

    return (
      <Grid key={j} gutter="xs">
        <Grid.Col span={5}>
          <Text size="sm" fw={500}>
            {startCase(key)}
          </Text>
        </Grid.Col>
        {value && (
          <Grid.Col span={7}>
            {getMaskedString() && (
              <Text size="sm">
                {getMaskedString()}
              </Text>
            )}
            {imageMask && imageMask.includes(key) && (
              <img 
                src={value} 
                alt={key} 
                style={{ maxHeight: '25px' }}
              />
            )}
            {linkMask && linkMask.includes(key) && (
              <Anchor 
                target="_blank" 
                rel="noreferrer" 
                href={value}
                style={{
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {value}
              </Anchor>
            )}
          </Grid.Col>
        )}
      </Grid>
    )
  })
}

export default DataList
