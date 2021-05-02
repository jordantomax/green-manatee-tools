import React from 'react'
import { Card } from 'react-bootstrap'

import { rateMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function Rates ({ rates }) {
  return (
    <div className='mb-4'>
      <h3>Rates</h3>

      {rates.length === 0 && (
        <Card>
          <Card.Body>
            No rates
          </Card.Body>
        </Card>
      )}

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
    </div>
  )
}

export default Rates
