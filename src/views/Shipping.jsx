import React from 'react'
import { useState } from 'react'
import { Container, Title, Paper, Group } from '@mantine/core'

import Shipments from '@/components/Shipments'
import ShippingManifest from '@/components/ShippingManifest'
import ShippingEmail from '@/components/ShippingEmail'

function Shipping () {
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ warningMessage, setWarningMessage ] = useState(null)

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="lg">
        <Title order={2} mb="md">Shipping</Title>
        <Shipments inline>
          {({ shipments }) => (
            <Group>
              <ShippingManifest shipments={shipments} />
              <ShippingEmail shipments={shipments} />
            </Group>
          )}
        </Shipments>
      </Paper>
    </Container>
  )
}

export default Shipping