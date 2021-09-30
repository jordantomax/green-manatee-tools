import React from 'react'
import styled from 'styled-components'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import {
  Row,
  Col
} from 'react-bootstrap'

import camelToSentenceCase from '../utils/camelToSentenceCase'

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
        } else if (isArray(value)) {
          return value.reduce((prev, cur) => prev + ', ' + cur)
        } else {
          return value
        }
      }
    }

    return (
      <Row className='mb-1' key={j}>
        <Col xs={5}>
          <span className='font-weight-bold'>
            {camelToSentenceCase(key)}
          </span>
        </Col>
        {value && (
          <Col xs={7}>
            {getMaskedString()}
            {imageMask && imageMask.includes(key) && <img src={value} alt={key} />}
            {linkMask && linkMask.includes(key) && <Link target='_blank' rel='noreferrer' href={value}>{value}</Link>}
          </Col>
        )}
      </Row>
    )
  })
}

const Link = styled.a`
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default DataList
