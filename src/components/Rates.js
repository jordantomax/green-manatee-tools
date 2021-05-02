import React from 'react'
import { Card, Button } from 'react-bootstrap'

import { rateMask, rateImageMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function Rates ({ rates }) {
  function handleClick () {
  }

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
                imageMask={rateImageMask}
              />
              <Button
                className='mt-2'
                variant='primary'
                onClick={handleClick}
              >
                Get This Rate
              </Button>
            </Card.Body>
          </Card>
        )
      })}
    </div>
  )
}

export default Rates
