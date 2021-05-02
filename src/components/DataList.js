import React from 'react'
import isObject from 'lodash/isObject'
import {
  Row,
  Col
} from 'react-bootstrap'

import camelToSentenceCase from '../utils/camelToSentenceCase'

function DataList ({ obj, mask, imageMask }) {
  return Object.entries(obj).map(([key, value], j) => {
    let isVisible = false
    if (
      (mask && mask.includes(key)) ||
      (imageMask && imageMask.includes(key))
    ) isVisible = true
    if (!isVisible) return false

    return (
      <Row className='mb-1' key={j}>
        <Col xs={5}>
          <span className='font-weight-bold'>
            {camelToSentenceCase(key)}
          </span>
        </Col>
        <Col xs={7}>
          {(imageMask && imageMask.includes(key))
            ? <img src={value} alt={key} />
            : !isObject(value) && value}
        </Col>
      </Row>
    )
  })
}

export default DataList
