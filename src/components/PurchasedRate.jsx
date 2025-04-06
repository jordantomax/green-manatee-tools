import React from 'react'
import { Paper, Title, Stack, Button, Text } from '@mantine/core'

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
    <Stack gap="md">

      <Paper p="xl" withBorder>
        <Title order={3}>Purchased Rate</Title>
        <Stack gap="md">
          <Title order={4}>Master Label</Title>
          <DataList
            obj={rate}
            mask={purchasedRateMask}
            linkMask={purchasedRateLinkMask}
          />

          {results && results.length > 0 && (
            <>
              <Stack gap="xs">
                <Title order={5}>All Tracking Numbers</Title>
                <Text>{results.map(result => result.trackingNumber).reduce((prev, tn) => prev + ', ' + tn)}</Text>
              </Stack>

              <Stack gap="xs">
                <Title order={5}>Merged Labels</Title>
                <Button
                  disabled={isLoadingMergedLabels}
                  onClick={getMergedLabels}
                >
                  {isLoadingMergedLabels && <ButtonSpinner />}
                  Download merged labels PDF
                </Button>
              </Stack>

              <Stack gap="md">
                <Title order={5}>All Labels</Title>
                {results.map(result => (
                  <DataList
                    key={result.objectId}
                    obj={result}
                    mask={purchasedRateMask}
                    linkMask={purchasedRateLinkMask}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}

export default PurchasedRate
