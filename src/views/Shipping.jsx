import { useState } from 'react'
import { Container, Alert, Title, Paper, Button, Group } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

import NotionShipments from '../components/NotionShipments'
import ShippingManifest from '../components/ShippingManifest'
import ShippingEmail from '../components/ShippingEmail'

function Shipments () {
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ warningMessage, setWarningMessage ] = useState(null)

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="lg">
        <Title order={2} mb="md">Shipping</Title>
        <NotionShipments inline>
          {({ shipments }) => (
            <Group>
              <ShippingManifest shipments={shipments} />
              <ShippingEmail shipments={shipments} />
            </Group>
          )}
        </NotionShipments>
      </Paper>
    </Container>
  )
}

export default Shipments
