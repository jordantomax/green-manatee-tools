import React from 'react'
import { Card } from 'react-bootstrap'

import { purchasedRateMask, purchasedRateLinkMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function PurchasedRate ({ rate }) {
  if (!rate) return null

  console.log(rate)
  return (
    <>
      <h3>Purchased Rate</h3>

      <Card className='mb-4'>
        <Card.Body>

          <DataList
            obj={rate}
            mask={purchasedRateMask}
            linkMask={purchasedRateLinkMask}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default PurchasedRate
