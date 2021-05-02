import React from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {
  Container,
  Form,
  Row,
  Col
} from 'react-bootstrap'

import { setLocalData, getLocalData } from '../utils/storage'
import { addressFactory } from '../factories'
import useForm from '../hooks/useForm'
import HeaderNav from '../components/Nav'
import Address from '../components/Address'
import Parcels from '../components/Parcels'
import RateParcels from '../components/RateParcels'

function Home () {
  const [rateParcels, setRateParcels] = React.useState(getLocalData('rateParcels') || [])
  const [rates, setRates] = React.useState(getLocalData('rates') || [])

  const {
    input,
    isLoading,
    handleChange,
    handleSubmit
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
    afterSubmit: (res) => {
      setLocalData('rateParcels', res.parcels)
      setLocalData('rates', res.rates)
      setRateParcels(res.parcels)
      setRates(res.rates)
    }
  })

  return (
    <>
      <HeaderNav
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />

      <Container fluid='sm' className='pt-5'>
        <Row className='pb-5 pt-5'>
          <Col xs={12} sm={6}>
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
          </Col>

          <Col xs={12} sm={6}>
            <RateParcels parcels={rateParcels} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
