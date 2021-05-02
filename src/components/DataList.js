import React from 'react'
import isObject from 'lodash/isObject'
import {
  Row,
  Col
} from 'react-bootstrap'

import camelToSentenceCase from '../utils/camelToSentenceCase'

function DataList ({ obj, mask }) {
  return Object.entries(obj).map(([key, value], j) => {
    if (mask && !mask.includes(key)) return false

    return (
      <Row className='mb-1' key={j}>
        <Col xs={4}>
          <span className='font-weight-bold'>
            {camelToSentenceCase(key)}
          </span>
        </Col>
        <Col xs={8}>{!isObject(value) && value}</Col>
      </Row>
    )
  })
}

export default DataList
