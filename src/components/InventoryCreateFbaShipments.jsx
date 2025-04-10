import React, { useState } from 'react'
import { Button } from '@mantine/core'

import api from '../utils/api'

function InventoryCreateFbaShipments ({ restock }) {
  const [isLoading, setIsLoading] = useState(false)
  async function createFbaShipments () {
    setIsLoading(true)
    await api.createFbaShipments(restock)
    setIsLoading(false)
  }

  return (
    <Button
      disabled={!restock}
      onClick={createFbaShipments}
      loading={isLoading}
      variant="light"
    >
      Create All FBA shipments
    </Button>
  )
}

export default InventoryCreateFbaShipments
