import React from 'react'
import { Paper, Title, Stack, Button, Text, Group } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'

import api from '../utils/api'

function PurchasedRate ({ rate }) {
  const [labels, setLabels] = React.useState([])
  const [isLoadingMergedLabels, setIsLoadingMergedLabels] = React.useState(false)
  const rateId = React.useRef(null)

  React.useEffect(() => {
    if (!rate?.rate || rateId.current === rate.rate) return

    rateId.current = rate.rate
    api.shippoGetLabels(rateId.current)
      .then(res => setLabels(res.results))
      .catch(err => console.warn(err))
  }, [rate?.rate])

  async function getMergedLabels () {
    const pdfUrls = labels.map(result => result.labelUrl).reverse()
    setIsLoadingMergedLabels(true)
    await api.mergePdfs({ urls: pdfUrls })
    setIsLoadingMergedLabels(false)
  }

  if (!labels || labels.length === 0) return null

  return (
    <Stack gap="md">
      <Paper p="lg" withBorder>
        <Stack gap="md">
          <Title order={3}>Purchased Rate</Title>
          <Stack gap="xs">
            <Title order={4}>Tracking Numbers</Title>
            <Text size="sm">{labels.map(label => label.trackingNumber).reduce((prev, tn) => prev + ', ' + tn)}</Text>
            <Button
              disabled={isLoadingMergedLabels}
              onClick={getMergedLabels}
              loading={isLoadingMergedLabels}
              leftSection={<IconDownload size={16} />}
            >
              Download All Labels
            </Button>
          </Stack>
          <Stack gap="md">
            <Title order={4}>Labels</Title>
            {labels.map(label => (
              <Paper key={label.objectId} p="md" withBorder>
                <Stack gap="xs">
                  <Group>
                    <Text size="sm" fw={500} w={150}>Tracking Number:</Text>
                    <Text size="sm">{label.trackingNumber}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} w={150}>label:</Text>
                    <Text size="sm">
                      <a href={label.labelUrl} target="_blank" rel="noopener noreferrer">
                        View Label
                      </a>
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default PurchasedRate
