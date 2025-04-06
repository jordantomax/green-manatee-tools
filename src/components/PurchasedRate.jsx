import React from 'react'
import { Card, Button } from 'react-bootstrap'

import api from '../utils/api'
import { purchasedRateMask, purchasedRateLinkMask } from '../utils/dataMasks'
import DataList from './DataList'
import ButtonSpinner from './ButtonSpinner'

function PurchasedRate ({ rate }) {
  const [results, setResults] = React.useState(null)
  const [isLoadingMergedLabels, setIsLoadingMergedLabels] = React.useState(false)
  const rateId = React.useRef(null)

  React.useEffect(() => {
    if (!rate?.rate || rateId.current === rate.rate) return

    try {
      rateId.current = rate.rate
      api.shippoGetLabel({ rate: rateId.current })
        .then(res => setResults(res.results))
        .catch(err => console.warn(err))
    } catch (err) {
      console.warn(err)
    }
  }, [rate?.rate])

  async function getMergedLabels () {
    const pdfUrls = results.map(result => result.labelUrl).reverse()
    setIsLoadingMergedLabels(true)
    await api.mergePdfs({
      urls: pdfUrls
    })
    setIsLoadingMergedLabels(false)
  }

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
                <h4>Merged Labels</h4>
                <Button
                  disabled={isLoadingMergedLabels}
                  onClick={getMergedLabels}
                >
                  {isLoadingMergedLabels && <ButtonSpinner />}
                  Download merged labels PDF
                </Button>
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
