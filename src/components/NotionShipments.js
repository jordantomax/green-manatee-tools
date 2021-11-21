import React, { useState } from 'react'
import {
  Button,
  Modal,
  ListGroup
} from 'react-bootstrap'

import { NOTION_SHIPMENTS_DB_ID } from '../constants'
import callNotion from '../utils/notion'
import ButtonSpinner from '../components/ButtonSpinner'

function NotionShipments () {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)

  function handleClose () { setData(null) }

  function handleClick (shipment) {
    console.log(shipment)
  }

  async function getNotionShipments () {
    setIsLoading(true)
    const path = `databases/${NOTION_SHIPMENTS_DB_ID}/query`
    const res = await callNotion(path, 'POST')
    setIsLoading(false)
    setData(res.results)
  }

  return (
    <>
      <Button
        className='mb-3'
        disable={isLoading}
        onClick={getNotionShipments}
      >
        {isLoading && <ButtonSpinner />}
        Populate from Notion Shipment
      </Button>

      <Modal show={data && true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Shipments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {data && data.map(shipment => {
              return (
                <ListGroup.Item
                  key={shipment.id}
                  action
                  onClick={() => handleClick(shipment)}
                >
                  {shipment.properties?.id?.title[0]?.plainText}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Modal.Body>
        something
      </Modal>
    </>
  )
}

export default NotionShipments
