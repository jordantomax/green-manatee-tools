import React, { useState } from 'react'
import {
  Button,
  Modal,
  ListGroup
} from 'react-bootstrap'

import { NOTION_SHIPMENTS_DB_ID } from '../constants'
import notion from '../utils/notion'
import { addressFactory, parcelFactory } from '../factories'
import ButtonSpinner from '../components/ButtonSpinner'

function NotionShipments ({ bulkUpdate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingShipmentId, setIsLoadingShipmentId] = useState(null)
  const [data, setData] = useState(null)

  function handleClose () { setData(null) }

  async function getShipments () {
    setIsLoading(true)
    const res = await notion.dbQuery(NOTION_SHIPMENTS_DB_ID)
    setIsLoading(false)
    setData(res.results)
  }

  async function selectShipment (shipment) {
    setIsLoadingShipmentId(shipment.id)
    const [origin, destination, cartonTemplate] = await Promise.all(
      ['origin', 'destination', 'cartonTemplate'].map(async (prop) => {
        const id = shipment.properties[prop]?.relation[0]?.id
        return await notion.pageRetrieve(id)
      })
    )
    const addressProps = ['name', 'street1', 'city', 'state', 'zipCode', 'country', 'phone', 'email']
    const addressFromBase = notion.massagePage(origin, addressProps, { zipCode: 'zip' })
    const addressToBase = notion.massagePage(destination, addressProps, { zipCode: 'zip' })
    const parcelBase = notion.massagePage(cartonTemplate, ['grossWeightLb', 'heightIn', 'lengthIn', 'widthIn'], { grossWeightLb: 'weight', heightIn: 'height', lengthIn: 'length', widthIn: 'width' })

    const addressFrom = Object.assign({}, addressFactory(), addressFromBase)
    const addressTo = Object.assign({}, addressFactory(), addressToBase)
    const parcel = Object.assign({}, parcelFactory(), parcelBase)
    parcel.quantity = shipment.properties.numCartons.number

    bulkUpdate({ addressFrom, addressTo, parcels: [parcel] })
    setIsLoadingShipmentId(null)
    handleClose()
  }

  return (
    <>
      <Button
        className='mb-3'
        disabled={isLoading}
        onClick={getShipments}
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
                  onClick={() => selectShipment(shipment)}
                >
                  {isLoadingShipmentId === shipment.id && <ButtonSpinner />}
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
