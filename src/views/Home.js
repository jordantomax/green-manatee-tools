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
import { addressFactory, parcelFactory } from '../factories'
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

  function handleParcelChange (value) {
    handleChange({
      target: { name: 'parcels', value }
    })
  }

  function handleParcelCreate () {
    const parcels = input.parcels.slice()
    parcels.push(parcelFactory())
    handleParcelChange(parcels)
  }

  function handleParcelDelete (i) {
    const parcels = input.parcels.slice()
    parcels.splice(i, 1)
    handleParcelChange(parcels)
  }

  function handleParcelUpdate (i, name, value) {
    const parcels = input.parcels.slice()
    parcels[i][name] = value
    handleParcelChange(parcels)
  }

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
                handleDelete={handleParcelDelete}
                handleUpdate={handleParcelUpdate}
              />

              <Button onClick={handleParcelCreate}>
                new Parcel
              </Button>
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
