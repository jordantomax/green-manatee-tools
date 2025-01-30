import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Badge
} from 'react-bootstrap'

import { setLocalData, getLocalData } from '../utils/storage'
import ButtonSpinner from '../components/ButtonSpinner'
import api from '../utils/api'
import InventoryRestockRecs from '../components/InventoryRestockRecs'
import InventoryCreateFbaShipments from '../components/InventoryCreateFbaShipments'

function Inventory () {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [data, setData] = useState(getLocalData('inventoryRecs'))
  const [datetime, setDatetime] = useState(new Date(getLocalData('inventoryRecsDatetime')))

  async function getRecommendations () {
    if (errorMessage) setErrorMessage(null)
    setIsLoading(true)
    const { data } = await api.getRecs()
    setIsLoading(false)
    if (!data) {
      setErrorMessage('Request failed')
      return
    }
    setLocalData('inventoryRecs', data)
    setData(data)
    const date = new Date()
    setLocalData('inventoryRecsDatetime', date)
    setDatetime(date)
  }

  return (
    <Container>
      <Row>
        <Col className='pt-5'>
          {errorMessage && (
            <Alert variant='danger'>
              {errorMessage}
            </Alert>
          )}

          <h1>Inventory Manager</h1>

          <div className='mb-4'>
            <Button
              variant="primary"
              disabled={isLoading}
              onClick={getRecommendations}
            >
              {isLoading && <ButtonSpinner />}
              Get inventory recommendations
            </Button>

            <InventoryCreateFbaShipments restock={data.restockNeeded} />
          </div>

          {data ? (
            <>
              <Badge className='mb-4' variant='success'>
                Synced on {datetime.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "long" })} at {datetime.toLocaleString("en-US", { timeZone: "America/Los_Angeles", timeStyle: "long" })}
              </Badge>

              <h2>Restock needed</h2>
              <InventoryRestockRecs products={data.restockNeeded} />

              <h2>No restock needed</h2>
              <InventoryRestockRecs products={data.noRestockNeeded} />
            </>
          ) : ''}
        </Col>
      </Row>
    </Container>
  )
}

export default Inventory
