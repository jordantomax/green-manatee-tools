import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import capitalize from 'lodash/capitalize'

import { NOTION_LOCATIONS_DB_ID } from '../constants'
import { setLocalData, getLocalData } from '../utils/storage'
import { getNotionProp } from '../utils/notion'

import api from '../utils/api'
import Input from './Input'
import SelectModal from './SelectModal'
import ButtonSpinner from './ButtonSpinner'

function Address ({ address, name, handleChange }) {
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [modalData, setModalData] = useState(null)

  async function getLocations(forceUpdate) {
    let locations = getLocalData('notionLocations')
    setIsLoading(true)
    if (!locations || forceUpdate) {
      locations = await api.queryNotionDatabase(NOTION_LOCATIONS_DB_ID)
    }
    setIsLoading(false)
    setModalIsVisible(true)
    setLocalData('notionLocations', locations)
    setModalData(locations)
  }
  
  async function handleSelect(location) {
    const p = location.properties
    const address = {
      name: getNotionProp(p.name),
      company: getNotionProp(p.company),
      street1: getNotionProp(p.street1),
      street2: getNotionProp(p.street2),
      city: getNotionProp(p.city),
      state: getNotionProp(p.state),
      zip: getNotionProp(p.zipCode),
      country: getNotionProp(p.country),
      phone: getNotionProp(p.phone),
      email: getNotionProp(p.email)
    }

    Object.entries(address).forEach(([key, value]) => {
      console.log(name, key, value)
      if (value) {
        handleChange({ 
          target: { 
            name: `${name}.${key}`, 
            value 
          } 
        })
      }
    })
  }

  return (
    <>
      <Button
        size='sm'
        variant='outline-secondary'
        className='mb-3'
        disabled={isLoading}
        onClick={() => getLocations()}
      >
        {isLoading && <ButtonSpinner />}
        Use Saved Location
      </Button>

      <SelectModal 
        title='Select Location'
        data={modalData}
        show={modalIsVisible}
        labelKey='properties.name.title.0.plainText'
        onHide={() => setModalIsVisible(false)}
        onSelect={handleSelect}
      />

      <div className='pb-4'>
        {Object.entries(address)
          .filter(([key]) => key !== 'id')
          .map(([key, value], i) => {
            return (
              <Input
                key={`${address.id}${key}`}
                id={`${name}.${key}`}
                label={capitalize(key)}
                onChange={handleChange}
                defaultValue={value}
              />
            )
          })}
      </div>
    </>
  )
}

export default Address
