import React from 'react'
import { Paper, Stack, Button, Text, Title, Group, Image, Box } from '@mantine/core'
import { useForm } from '@mantine/form'

import api from '@/utils/api'

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
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start">
                        <Stack gap="xs">
                          <Group>
                            <Text size="sm" fw={500} w={100}>Amount:</Text>
                            <Text size="sm">${rate.amount}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500} w={100}>Attributes:</Text>
                            <Text size="sm">{rate.attributes.join(', ')}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500} w={100}>Provider:</Text>
                            <Text size="sm">{rate.provider}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500} w={100}>Service:</Text>
                            <Text size="sm">{rate.servicelevel.name}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500} w={100}>Days:</Text>
                            <Text size="sm">{rate.estimatedDays}</Text>
                          </Group>
                        </Stack>
                        <Box pos="absolute" top={20} right={20} w={50}>
                          <Image
                            src={rate.providerImage75}
                            alt={rate.provider}
                            fit="contain"
                          />
                        </Box>
                      </Group>

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
