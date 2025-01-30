import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

import api from '../utils/api'
import ButtonSpinner from '../components/ButtonSpinner'

function InventoryCreateFbaShipments ({ restock }) {
  const [isLoading, setIsLoading] = useState(false)
  async function createFbaShipments () {
    setIsLoading(true)
    await api.createFbaShipments(restock)
    setIsLoading(false)
  }

  return (
    <Button
      className="ml-2"
      disabled={isLoading}
      variant="outline-info"
      onClick={createFbaShipments}
    >
      {isLoading && <ButtonSpinner />}
      Create All FBA shipments
    </Button>
  )
}

export default InventoryCreateFbaShipments
