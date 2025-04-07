import React from 'react'
import { Paper, Title, Stack, Button, Text, Group } from '@mantine/core'

import api from '../utils/api'

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
    await api.mergePdfs({ urls: pdfUrls })
    setIsLoadingMergedLabels(false)
  }

  if (!rate) return null

  return (
    <Stack gap="md">
      <Paper p="xl" withBorder>
        <Title order={2}>Purchased Rate</Title>
        <Stack gap="md">
          <Stack gap="xs">
            <Group>
              <Text size="sm" fw={500} w={150}>trackingNumber:</Text>
              <Text size="sm">{rate.trackingNumber}</Text>
            </Group>
            <Group>
              <Text size="sm" fw={500} w={150}>labelUrl:</Text>
              <Text size="sm">
                <a href={rate.labelUrl} target="_blank" rel="noopener noreferrer">
                  {rate.labelUrl}
                </a>
              </Text>
            </Group>
          </Stack>

          {results && results.length > 0 && (
            <>
              <Stack gap="xs">
                <Text size="sm" fw={500}>All Tracking Numbers</Text>
                <Text size="sm">{results.map(result => result.trackingNumber).reduce((prev, tn) => prev + ', ' + tn)}</Text>
              </Stack>

              <Stack gap="xs">
                <Button
                  disabled={isLoadingMergedLabels}
                  onClick={getMergedLabels}
                  loading={isLoadingMergedLabels}
                >
                  Download All Labels
                </Button>
              </Stack>

              <Stack gap="md">
                <Title order={5}>All Labels</Title>
                {results.map(result => (
                  <Paper key={result.objectId} p="md" withBorder>
                    <Stack gap="xs">
                      <Group>
                        <Text size="sm" fw={500} w={150}>trackingNumber:</Text>
                        <Text size="sm">{result.trackingNumber}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} w={150}>labelUrl:</Text>
                        <Text size="sm">
                          <a href={result.labelUrl} target="_blank" rel="noopener noreferrer">
                            Download Label
                          </a>
                        </Text>
                      </Group>
                    </Stack>
                  </Paper>
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
