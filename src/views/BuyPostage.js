import React, { useState } from 'react'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import {
  Container,
  Form,
  Row,
  Col
} from 'react-bootstrap'

import { setLocalData, getLocalData } from '../utils/storage'
import { addressFactory, parcelFactory } from '../factories'
import notion from '../utils/notion'
import useForm from '../hooks/useForm'
import HeaderNav from '../components/Nav'
import Address from '../components/Address'
import Parcels from '../components/Parcels'
import RateParcels from '../components/RateParcels'
import Rates from '../components/Rates'
import PurchasedRate from '../components/PurchasedRate'
import NotionShipments from '../components/NotionShipments'

function BuyPostage () {
  const [rateParcels, setRateParcels] = useState(getLocalData('rateParcels') || [])
  const [rates, setRates] = useState(getLocalData('rates') || [])
  const [purchasedRate, setPurchasedRate] = useState(getLocalData('purchasedRate') || null)
  const {
    input,
    isLoading,
    handleChange,
    handleSubmit,
    bulkUpdate
  } = useForm({
    resource: 'shipment',
    action: 'create',
    defaultInput: {
      addressFrom: getLocalData('addressFrom') || addressFactory(),
      addressTo: getLocalData('addressTo') || addressFactory(),
      parcels: getLocalData('parcels') || []
    },
    massageInput: (input) => {
      const massaged = cloneDeep(input)
      massaged.parcels.forEach((parcel, i) => {
        const qty = parcel.quantity
        delete parcel.id
        delete parcel.quantity

        if (qty > 1) {
          const copies = []
          for (let j = 1; j < qty; j++) {
            copies.push(Object.assign({}, parcel))
          }
          massaged.parcels.splice(i, 0, ...copies)
        }
      })
      return massaged
    },
    afterChange: (newInput) => {
      setLocalData('addressFrom', newInput.addressFrom)
      setLocalData('addressTo', newInput.addressTo)
      setLocalData('parcels', newInput.parcels)
    },
    afterSubmit: setRateData
  })

  function setRateData (data) {
    setLocalData('rateParcels', data.parcels)
    setLocalData('rates', data.rates)
    setRateParcels(data.parcels)
    setRates(data.rates)
  }

  function _setPurchasedRate (rate) {
    setLocalData('purchasedRate', rate)
    setPurchasedRate(rate)
  }

  async function handleSelectNotionShipment (shipments) {
    const shipment = shipments[0]
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
  }

  return (
    <>
      <HeaderNav
        isLoading={isLoading}
        setRateData={setRateData}
        setPurchasedRate={_setPurchasedRate}
        handleSubmit={handleSubmit}
      />

      <Container fluid>
        <Row className='pt-5'>
          <ColWithBg xs={12} sm={6} className='pb-5 pt-5'>
            <NotionShipments handleSelectShipment={handleSelectNotionShipment} />

            <Form>
              <Address
                address={input.addressFrom}
                name='addressFrom'
                handleChange={handleChange}
              />

              <Address
                address={input.addressTo}
                name='addressTo'
                handleChange={handleChange}
              />

              <Parcels
                parcels={input.parcels}
                handleChange={handleChange}
              />
            </Form>
          </ColWithBg>

          <Col xs={12} sm={6} className='pt-5'>
            <PurchasedRate rate={purchasedRate} />
            <Rates
              rates={rates}
              setPurchasedRate={_setPurchasedRate}
            />
            <RateParcels parcels={rateParcels} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

const ColWithBg = styled(Col)`
  background-color: #eaeaea;
  border-right: 1px solid #d5d5d5;
`

export default BuyPostage
