import React from 'react'
import { Card } from 'react-bootstrap'

import shippo from '../utils/shippo'
import { purchasedRateMask, purchasedRateLinkMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function PurchasedRate ({ rate }) {
  const [results, setResults] = React.useState(null)

  React.useEffect(() => {
    async function getLabels () {
      try {
        const res = await shippo('transaction', 'list', {
          rate: rate.rate,
          results: 50
        })
        setResults(res.results)
      } catch (err) {
        console.warn(err)
      }
    }

    getLabels()
  }, [rate])

  if (!rate) return null

  return (
    <>
      <h3>Purchased Rate</h3>

      <Card className='mb-4'>
        <Card.Body>
          <h4>Master Label</h4>
          <DataList
            obj={rate}
            mask={purchasedRateMask}
            linkMask={purchasedRateLinkMask}
          />

          {results && results.length > 0 && (
            <>
              <div className='mt-4'>
                <h4>All Tracking Numbers</h4>
                {results.map(result => result.trackingNumber).reduce((prev, tn) => prev + ', ' + tn)}
              </div>

              <div className='mt-4'>
                <h4>All Labels</h4>
                {results.map(result => {
                  return (
                    <DataList
                      key={result.objectId}
                      obj={result}
                      mask={purchasedRateMask}
                      linkMask={purchasedRateLinkMask}
                    />
                  )
                })}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default PurchasedRate
