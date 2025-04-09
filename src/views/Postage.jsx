import React, { useState } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {
  Container,
  Button,
  Stack,
  Group,
  Grid,
  Paper,
  Card,
  Box
} from '@mantine/core'
import { useForm } from '@mantine/form'

import api from '../utils/api'
import { setLocalData, getLocalData } from '../utils/storage'
import { addressFactory, parcelFactory, customsFactory } from '../factories'
import notion from '../utils/notion'
import Address from '../components/Address'
import Parcels from '../components/Parcels'
import RateParcels from '../components/RateParcels'
import Rates from '../components/Rates'
import PurchasedRate from '../components/PurchasedRate'
import NotionShipments from '../components/NotionShipments'
import Customs from '../components/Postage/Customs'
import Hazmat from '../components/Postage/Hazmat'

function Postage () {
  const [rateParcels, setRateParcels] = useState(getLocalData('shipment')?.rateParcels || [])
  const [rates, setRates] = useState(getLocalData('shipment')?.rates || [])
  const [purchasedRate, setPurchasedRate] = useState(getLocalData('purchasedRate') || null)
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [isLoadingShipment, setIsLoadingShipment] = useState(false)
  const savedInput = getLocalData('input') || {}

  const form = useForm({
    initialValues: {
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
    onValuesChange: (values) => {
      setLocalData('input', values)
    }
  })

  function setRateData (data) {
    setLocalData('shipment', data)
    setRateParcels(data.parcels)
    setRates(data.rates)
    data.messages?.forEach(message => {
      console.log(`${message.source}${message.code ? ` code ${message.code}` : ''}: ${message.text}`)
    })
  }

  function _setPurchasedRate (rate) {
    setLocalData('purchasedRate', rate)
    setPurchasedRate(rate)
  }

  async function handleSelectNotionShipment (shipments) {
    setIsLoadingShipment(true)
    try {
      const shipment = shipments[0]
      const [origin, destination, cartonTemplate] = await Promise.all(
        ['origin', 'destination', 'cartonTemplate'].map(async (prop) => {
          const relation = shipment.properties[prop]?.relation
          if (!relation || relation.length === 0) return null
          const page = await api.notionGetPage(relation[0].id)
          return page
        })
      )

      const addressProps = ['company', 'name', 'street1', 'city', 'state', 'zip', 'country', 'phone', 'email']
      const addressFromBase = origin ? notion.massagePage(origin, addressProps) : {}
      const addressToBase = destination ? notion.massagePage(destination, addressProps) : {}
      const parcelBase = cartonTemplate ? notion.massagePage(cartonTemplate, ['grossWeightLb', 'heightIn', 'lengthIn', 'widthIn'], { grossWeightLb: 'weight', heightIn: 'height', lengthIn: 'length', widthIn: 'width' }) : {}

      const addressFrom = Object.assign({}, addressFactory(), addressFromBase)
      const addressTo = Object.assign({}, addressFactory(), addressToBase)
      const parcel = Object.assign({}, parcelFactory(), parcelBase)
      parcel.quantity = shipment.properties.numCartons?.number || 1

      form.setValues({
        ...form.values,
        addressFrom,
        addressTo,
        parcels: [parcel]
      })
    } catch (error) {
      console.error('Error loading shipment:', error)
      throw error
    } finally {
      setIsLoadingShipment(false)
    }
  }

  function handleResetRates () {
    setRateData({ rates: [], parcels: [] })
    _setPurchasedRate(null)
  }

  function isFormValid() {
    const { addressFrom, addressTo, parcels } = form.values
    
    // Check required address fields
    const requiredAddressFields = ['name', 'street1', 'city', 'state', 'zip', 'country']
    const isAddressValid = (address) => requiredAddressFields.every(field => address[field])
    
    // Check required parcel fields
    const requiredParcelFields = ['length', 'width', 'height', 'weight']
    const isParcelValid = (parcel) => requiredParcelFields.every(field => parcel[field])
    
    // Check if we have at least one parcel
    const hasValidParcels = parcels.length > 0 && parcels.every(isParcelValid)
    
    return isAddressValid(addressFrom) && isAddressValid(addressTo) && hasValidParcels
  }

  async function handleSubmit(values) {
    setIsLoadingRates(true)
    try {
      const massaged = cloneDeep(values)

      if (values.addressTo.country === 'US') {
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

      const response = await api.shippoGetRates(massaged)
      setRateData(response)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoadingRates(false)
    }
  }

  return (
    <Container fluid>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Box pb="md">
            <NotionShipments>
              {({ shipments, setOpened }) => (
                <Button 
                  loading={isLoadingShipment}
                  onClick={async () => {
                    if (shipments.length !== 1) {
                      alert('Please select exactly one shipment')
                      return
                    }
                    try {
                      await handleSelectNotionShipment(shipments)
                      setOpened(false)
                    } catch (error) {
                      console.error('Error selecting shipment:', error)
                    }
                  }}
                  disabled={shipments.length === 0}
                >
                  Select Notion Shipment
                </Button>
              )}
            </NotionShipments>
          </Box>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <Card>
                  <Address
                    address={form.values.addressFrom}
                    name='addressFrom'
                    label='Origin'
                    handleChange={(e) => {
                      const { name, value } = e.target
                      const [parent, field] = name.split('.')
                      form.setFieldValue(`${parent}.${field}`, value)
                    }}
                  />
                </Card>

                <Card>
                  <Address
                    address={form.values.addressTo}
                    name='addressTo'
                    label='Destination'
                    handleChange={(e) => {
                      const { name, value } = e.target
                      const [parent, field] = name.split('.')
                      form.setFieldValue(`${parent}.${field}`, value)
                    }}
                  />
                </Card>

                {form.values.addressTo.country !== 'US' && (
                  <Card>
                    <Customs
                      data={form.values.customsDeclaration}
                      handleChange={(e) => {
                        const { name, value } = e.target
                        if (name === 'customsDeclaration.items') {
                          form.setFieldValue('customsDeclaration.items', value)
                        } else {
                          form.setFieldValue(`customsDeclaration.${name}`, value)
                        }
                      }}
                    />
                  </Card>
                )}

                <Card>
                  <Parcels
                    parcels={form.values.parcels}
                    handleChange={(e) => {
                      const { value } = e.target
                      form.setFieldValue('parcels', value)
                    }}
                  />
                </Card>

                <Card>
                  <Hazmat
                    hazmat={form.values.extra.dangerousGoods.contains}
                    handleChange={(e) => {
                      const { name, value } = e.target
                      form.setFieldValue(`extra.dangerousGoods.${name}`, value)
                    }}
                  />
                </Card>

              </Stack>
            </form>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack gap="md">
            <Group gap="md">
              <Button
                type="submit"
                variant='primary'
                loading={isLoadingRates}
                disabled={!isFormValid()}
                onClick={() => form.onSubmit(handleSubmit)()}
              >
                Check Rates
              </Button>

              <Button variant='light' onClick={handleResetRates}>
                Reset Rates
              </Button>
            </Group>

            <PurchasedRate rate={purchasedRate} />

            <Card>
              <Rates
                rates={rates}
                setPurchasedRate={_setPurchasedRate}
              />
            </Card>

            <Card>
              <RateParcels parcels={rateParcels} />
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Postage
