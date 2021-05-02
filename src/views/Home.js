import React from 'react'
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

function Home () {
  const {
    input,
    handleChange,
    handleSubmit
  } = useForm({
    defaultInput: {
      from: getLocalData('from') || addressFactory(),
      to: getLocalData('to') || addressFactory(),
      parcels: getLocalData('parcels') || []
    },
    afterChange: (newInput) => {
      setLocalData('from', newInput.from)
      setLocalData('to', newInput.to)
      setLocalData('parcels', newInput.parcels)
    }
  })

  return (
    <>
      <HeaderNav handleSubmit={handleSubmit} />

      <Container fluid='sm' className='pt-5'>
        <Row className='pb-5 pt-5'>
          <Col xs={12} sm={6}>
            <Form>
              <Address
                address={input.from}
                name='from'
                handleChange={handleChange}
              />

              <Address
                address={input.to}
                name='to'
                handleChange={handleChange}
              />

              <Parcels
                parcels={input.parcels}
                handleChange={handleChange}
              />
            </Form>
          </Col>

        </Row>
      </Container>
    </>
  )
}

export default Home
