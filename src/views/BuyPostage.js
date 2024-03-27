import React, { useState } from 'react'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import {
  Container,
  Form,
  Row,
  Col,
  Button
} from 'react-bootstrap'

import { setLocalData, getLocalData } from '../utils/storage'
import { addressFactory, parcelFactory, customsFactory } from '../factories'
import notion from '../utils/notion'
import useForm from '../hooks/useForm'
import Address from '../components/Address'
import Parcels from '../components/Parcels'
import RateParcels from '../components/RateParcels'
import Rates from '../components/Rates'
import PurchasedRate from '../components/PurchasedRate'
import NotionShipments from '../components/NotionShipments'
import Messages from '../components/BuyPostage/Messages'
import Customs from '../components/BuyPostage/Customs'
import Hazmat from '../components/BuyPostage/Hazmat'
import ButtonSpinner from '../components/ButtonSpinner'

function BuyPostage () {
  const [rateParcels, setRateParcels] = useState(getLocalData('shipment')?.rateParcels || [])
  const [rates, setRates] = useState(getLocalData('shipment')?.rates || [])
  const [messages, setMessages] = useState(getLocalData('shipment')?.messages || [])
  const [purchasedRate, setPurchasedRate] = useState(getLocalData('purchasedRate') || null)
  const savedInput = getLocalData('input') || {}
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
      addressFrom: savedInput.addressFrom || addressFactory(),
      addressTo: savedInput.addressTo || addressFactory(),
      customsDeclaration: savedInput.customsDeclaration || customsFactory(),
      parcels: savedInput.parcels || [],
      extra: {
        dangerousGoods: {
          contains: savedInput.extra?.dangerousGoods?.contains || false
        }
      }
    },
    massageInput: (input) => {
      const massaged = cloneDeep(input)

      if (input.addressTo.country === 'US') {
        delete massaged.customsDeclaration
      }

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
    afterChange: input => setLocalData('input', input),
    afterSubmit: setRateData
  })

  function setRateData (data) {
    setLocalData('shipment', data)
    setRateParcels(data.parcels)
    setRates(data.rates)
    setMessages(data.messages)
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
        return id ? await notion.pageGet(id) : null
      })
    )
    const addressProps = ['company', 'name', 'street1', 'city', 'state', 'zipCode', 'country', 'phone', 'email']
    const addressFromBase = notion.massagePage(origin, addressProps, { zipCode: 'zip' })
    const addressToBase = notion.massagePage(destination, addressProps, { zipCode: 'zip' })
    const parcelBase = notion.massagePage(cartonTemplate, ['grossWeightLb', 'heightIn', 'lengthIn', 'widthIn'], { grossWeightLb: 'weight', heightIn: 'height', lengthIn: 'length', widthIn: 'width' })

    const addressFrom = Object.assign({}, addressFactory(), addressFromBase)
    const addressTo = Object.assign({}, addressFactory(), addressToBase)
    const parcel = Object.assign({}, parcelFactory(), parcelBase)
    parcel.quantity = shipment.properties.numCartons.number

    bulkUpdate({ addressFrom, addressTo, parcels: [parcel] })
  }

  function handleResetRates () {
    setRateData({ rates: [], parcels: [] })
    _setPurchasedRate(null)
  }

  return (
    <>
      <Container fluid>
        <Row>
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

              {input.addressTo.country !== 'US' &&
                <Customs
                  data={input.customsDeclaration}
                  handleChange={handleChange}
                />}

              <Hazmat
                hazmat={input.extra.dangerousGoods.contains}
                handleChange={handleChange}
              />

              <Parcels
                parcels={input.parcels}
                handleChange={handleChange}
              />
            </Form>
          </ColWithBg>

          <Col xs={12} sm={6} className='pt-5'>
            <div className='mb-3'>
              <Button variant='secondary' onClick={handleResetRates}>
                Reset Rates
              </Button>

              <Button
                className='ml-2'
                variant='primary'
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading && <ButtonSpinner />}
                Check Rates
              </Button>
            </div>

            <PurchasedRate rate={purchasedRate} />
            <Messages messages={messages} />
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
