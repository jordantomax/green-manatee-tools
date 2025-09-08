import React, { useState } from 'react'
import cloneDeep from 'lodash-es/cloneDeep'
import {
  Container,
  Button,
  Stack,
  Group,
  Grid,
  Card,
  Box
} from '@mantine/core'
import { useForm } from '@mantine/form'

import { useError } from '@/contexts/Error'
import api from '@/api'
import { setLocalData, getLocalData } from '@/utils/storage'
import { addressFactory, parcelFactory, customsFactory } from '@/factories'
import Address from '@/components/Address'
import Parcels from '@/components/Parcels'
import RateParcels from '@/components/RateParcels'
import Rates from '@/components/Rates'
import PurchasedRate from '@/components/PurchasedRate'
import Shipments from '@/components/Shipments'
import Customs from '@/components/postage/Customs'
import Hazmat from '@/components/postage/Hazmat'

function Postage () {
  const [rateParcels, setRateParcels] = useState(getLocalData('shipment')?.rateParcels || [])
  const [rates, setRates] = useState(getLocalData('shipment')?.rates || [])
  const [purchasedRate, setPurchasedRate] = useState(getLocalData('purchasedRate') || null)
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [isLoadingShipment, setIsLoadingShipment] = useState(false)
  const savedInput = getLocalData('input') || {}
  const { showError } = useError()

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

  async function handleSelectShipment (shipments) {
    setIsLoadingShipment(true)
    try {
      const shipment = shipments[0]

      if (!shipment.properties.origin) {
        showError(new Error("No shipments found"))
        return
      }
      if (!shipment.properties.destination) {
        showError(new Error("No destination found"))
        return
      }
      if (!shipment.properties.cartonTemplate) {
        showError(new Error("No carton template found"))
        return
      }

      const origin = await api.getResource('origin', shipment.properties.origin.id)
      const destination = await api.getResource('destination', shipment.properties.destination.id)
      const cartonTemplate = await api.getResource('cartonTemplate', shipment.properties.cartonTemplate.id)

      // Helper function to extract address properties
      const getAddressProps = (page) => {
        if (!page) return {}
        const props = ['company', 'name', 'street1', 'city', 'state', 'zip', 'country', 'phone', 'email']
        return props.reduce((acc, prop) => {
          acc[prop] = page.properties[prop]?.value || ''
          return acc
        }, {})
      }

      const addressFrom = Object.assign({}, addressFactory(), getAddressProps(origin))
      const addressTo = Object.assign({}, addressFactory(), getAddressProps(destination))
      
      const { grossWeightLb, heightIn, lengthIn, widthIn } = cartonTemplate?.properties || {}
      const parcel = Object.assign({}, parcelFactory(), {
        weight: grossWeightLb?.value,
        height: heightIn?.value,
        length: lengthIn?.value,
        width: widthIn?.value
      })
      parcel.quantity = shipment.properties.numCartons?.value || 1

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
    <Container>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Box pb="md">
            <Shipments>
              {({ shipments, setOpened }) => (
                <Button 
                  loading={isLoadingShipment}
                  onClick={async () => {
                    if (shipments.length !== 1) {
                      alert('Please select exactly one shipment')
                      return
                    }
                    try {
                      await handleSelectShipment(shipments)
                      setOpened(false)
                    } catch (error) {
                      console.error('Error selecting shipment:', error)
                    }
                  }}
                  disabled={shipments.length === 0}
                >
                  Select Shipment
                </Button>
              )}
            </Shipments>
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
                        form.setFieldValue(name, value)
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
