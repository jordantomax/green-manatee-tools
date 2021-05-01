import React from 'react'
import {
  Container,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap'

import { setLocalData, getLocalData } from '../utils/storage'
import useForm from '../hooks/useForm'
import Nav from '../components/Nav'
import Address from '../components/Address'
import Parcels from '../components/Parcels'

function addressFactory (prefix) {
  return {
    name: '',
    company: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    email: ''
  }
}

function Home () {
  const {
    input,
    handleChange,
    handleSubmit
  } = useForm({
    defaultInput: {
      from: getLocalData('from') || addressFactory(),
      to: getLocalData('to') || addressFactory()
    },
    afterChange: (newInput) => {
      setLocalData('from', newInput.from)
      setLocalData('to', newInput.to)
    }
  })

  return (
    <>
      <Nav />

      <Container>
        <Row>
          <Col xs='6'>
            <Form onSubmit={handleSubmit}>
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

              <Parcels />

              <Button type='submit'>
                Something
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
