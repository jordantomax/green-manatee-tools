import React from 'react'
import { Paper, Stack, Button, Text, Title, Group, Image, Box } from '@mantine/core'
import { useForm } from '@mantine/form'

import api from '@/api'
import DataList from '@/components/DataList'

function Rates ({ rates, setPurchasedRate }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedRate, setSelectedRate] = React.useState(null)

  const form = useForm({
    initialValues: {
      rate: null,
      labelFileType: 'PDF_4x6'
    }
  })

  async function handleSubmit(values) {
    setIsLoading(true)
    try {
      const response = await api.shippoPurchaseLabel(values)
      setPurchasedRate(response)
    } catch (error) {
      console.error('Error purchasing rate:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSelect(rateId) {
    setSelectedRate(rateId)
    form.setFieldValue('rate', rateId)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Title order={3}>Available Rates</Title>

          {rates.length === 0 && (
            <Text c="dimmed">No rates</Text>
          )}

          {rates
            .sort((a, b) => {
              const fa = parseFloat(a.amount)
              const fb = parseFloat(b.amount)
              if (fa === fb) return 0
              return fa > fb ? 1 : -1
            })
            .map((rate, i) => {
              return (
                <Box pos="relative" key={rate.objectId}>
                  <Paper key={rate.objectId} p="md" withBorder>
                    <Stack>
                      <DataList 
                        data={rate} 
                        keys={[
                          { key: 'amount', prefix: '$' },
                          { key: 'attributes', label: 'Tags' },
                          { key: 'provider' },
                          { key: 'servicelevel.name', label: 'Service' },
                          { key: 'estimatedDays' }
                          ]} 
                      />

                      <Box pos="absolute" top={20} right={20} w={40}>
                        <Image
                          src={rate.providerImage75}
                          alt={rate.provider}
                          fit="contain"
                        />
                      </Box>

                      <Group gap="xs">
                        <Button
                          onClick={() => handleSelect(rate.objectId)}
                        >
                          Select
                        </Button>

                        {selectedRate === rate.objectId && (
                          <Button
                            type="submit"
                            variant="outline"
                            loading={isLoading}
                          >
                            Purchase
                          </Button>
                        )}
                      </Group>
                    </Stack>
                  </Paper>
                </Box>
              )
            })
          }
      </Stack>
    </form>
  )
}

export default Rates
