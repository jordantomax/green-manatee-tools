import React from 'react'
import { Card } from 'react-bootstrap'

import { rateMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function Rates ({ rates }) {
  return (
    <>
      <h3>Rates</h3>
      {rates.map((rate, i) => {
        return (
          <Card
            key={rate.objectId}
            className='mb-4'
          >
            <Card.Body>
              <DataList
                obj={rate}
                mask={rateMask}
              />
            </Card.Body>
          </Card>
        )
      })}
    </>
  )
}

export default Rates
