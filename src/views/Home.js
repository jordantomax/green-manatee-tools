import React from 'react'
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Nav
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
      parcels: []
    },
    afterChange: (newInput) => {
      setLocalData('from', newInput.from)
      setLocalData('to', newInput.to)
    }
  })

  return (
    <>
      <HeaderNav />

      <Container fluid='sm'>
        <Row className='pb-5'>
          <Col xs={12} sm={6}>
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

              <Parcels
                parcels={input.parcels}
                handleChange={handleChange}
              />

            </Form>
          </Col>

          <Col xs={12} sm={6}>
            <Nav className='justify-content-end'>
              <Nav.Item>
                <Button type='submit'>
                  Get Rates
                </Button>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
