import React, { useState } from 'react'
import {
  Button,
  Modal,
  ListGroup,
  Form
} from 'react-bootstrap'

import { setLocalData, getLocalData } from '../utils/storage'
import { NOTION_SHIPMENTS_DB_ID } from '../constants'
import notion from '../utils/notion'
import ButtonSpinner from '../components/ButtonSpinner'

function NotionShipments ({ handleSelectShipment, params }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSelect, setIsLoadingSelect] = useState(false)
  const [data, setData] = useState(null)
  const [shipments, setShipments] = useState([])
  const [includeDelivered, setIncludeDelivered] = useState(false)

  function handleClose () { setData(null) }

  async function getShipments (forceUpdate) {
    setIsLoading(true)
    let data = getLocalData('notionShipments')
    let params = {}

    if (!includeDelivered) {
      params = {
        filter: {
          property: 'Delivered',
          checkbox: {
            equals: false
          }
        }
      }
    }

    if (!data || forceUpdate) {
      const res = await notion.dbQuery(NOTION_SHIPMENTS_DB_ID, params)
      data = res.results
    }
    setIsLoading(false)
    setLocalData('notionShipments', data)
    setData(data)
  }

  async function handleClick () {
    await setIsLoadingSelect(true)
    await handleSelectShipment(shipments)
    await setIsLoadingSelect(false)
    handleClose()
  }

  function handleCheck (shipment) {
    const newShipments = [...shipments]
    const checkedShipmentIndex = newShipments.findIndex(s => s.id === shipment.id)
    if (checkedShipmentIndex >= 0) {
      newShipments.splice(checkedShipmentIndex, 1)
    } else {
      newShipments.push(shipment)
    }
    setShipments(newShipments)
  }

  return (
    <>
      <Button
        className='mb-3'
        disabled={isLoading}
        onClick={() => getShipments(false)}
      >
        {isLoading && <ButtonSpinner />}
        Select Notion Shipments
      </Button>

      <Modal centered show={data && true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Shipments</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '350px', overflow: 'scroll' }}>
          <ListGroup>
            {data && data.map(shipment => {
              return (
                <ListGroup.Item
                  key={shipment.id}
                  action
                  onClick={() => handleCheck(shipment)}
                >
                  <Form.Check
                    type='checkbox'
                    readOnly
                    checked={shipments.find(s => s.id === shipment.id) || false}
                    label={shipment.properties?.id?.title[0]?.plainText}
                  />
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Modal.Body>

        <Modal.Footer>
          <span onClick={() => setIncludeDelivered(!includeDelivered)}>
            <Form.Check
              inline
              type='checkbox'
              checked={includeDelivered}
              label='Include delivered'
            />
          </span>

          <Button variant='secondary' onClick={() => getShipments(true)} className='ml-3'>
            {isLoading && <ButtonSpinner />}
            Refresh
          </Button>

          <Button variant='primary' disabled={shipments <= 0} onClick={handleClick}>
            {isLoadingSelect && <ButtonSpinner />}
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default NotionShipments
