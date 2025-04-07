import React, { useState } from 'react'
import { Button, Stack, TextInput, Group, Paper, Title } from '@mantine/core'
import capitalize from 'lodash/capitalize'

import { NOTION_LOCATIONS_DB_ID } from '../constants'
import { setLocalData, getLocalData } from '../utils/storage'
import { getNotionProp } from '../utils/notion'

import api from '../utils/api'
import SelectModal from './SelectModal'
import ButtonSpinner from './ButtonSpinner'

function Address ({ address, name, handleChange, label }) {
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [modalData, setModalData] = useState(null)

  async function getLocations(forceUpdate) {
    let locations = getLocalData('notionLocations')
    setIsLoading(true)
    if (!locations || forceUpdate) {
      locations = await api.notionQueryDatabase(NOTION_LOCATIONS_DB_ID)
    }
    setIsLoading(false)
    setModalIsVisible(true)
    setLocalData('notionLocations', locations)
    setModalData(locations)
  }
  
  function hideModal() {
    setModalIsVisible(false)
  }
  
  async function handleRefresh() {
    getLocations(true)
  }
  
  async function handleSelect(location) {
    const p = location.properties
    const address = Object.fromEntries(
      Object.keys(p)
        .filter(key => key !== 'id')
        .map(key => [key, getNotionProp(p[key])])
    )

    Object.entries(address).forEach(([key, value]) => {
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
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2} style={{ margin: 0 }}>{label}</Title>
        <Button
          variant="light"
          disabled={isLoading}
          onClick={() => getLocations()}
        >
          {isLoading && <ButtonSpinner />}
          Search Locations 
        </Button>
      </Group>

      <SelectModal 
        title='Select Location'
        data={modalData}
        show={modalIsVisible}
        labelKey='properties.name.title.0.plainText'
        onHide={hideModal}
        isLoading={isLoading}
        onSelect={handleSelect}
        onRefresh={handleRefresh}
      />

      <Stack gap="md">
        <Group grow>
          <TextInput
            required
            label="Name"
            placeholder="Full name"
            value={address.name}
            onChange={handleChange}
            name={`${name}.name`}
          />
          <TextInput
            label="Company"
            placeholder="Company name"
            value={address.company}
            onChange={handleChange}
            name={`${name}.company`}
          />
        </Group>

        <TextInput
          required
          label="Street 1"
          placeholder="Street address"
          value={address.street1}
          onChange={handleChange}
          name={`${name}.street1`}
        />

        <TextInput
          label="Street 2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={address.street2}
          onChange={handleChange}
          name={`${name}.street2`}
        />

        <Group>
          <TextInput
            required
            label="City"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            name={`${name}.city`}
            style={{ flex: 3 }}
          />
          <TextInput
            required
            label="State"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
            name={`${name}.state`}
            style={{ flex: 1 }}
          />
          <TextInput
            required
            label="ZIP"
            placeholder="ZIP"
            value={address.zip}
            onChange={handleChange}
            name={`${name}.zip`}
            style={{ flex: 3 }}
          />
        </Group>

        <Group>
          <TextInput
            required
            label="Country"
            placeholder="Country"
            value={address.country}
            onChange={handleChange}
            name={`${name}.country`}
            style={{ flex: 2 }}
          />
          <TextInput
            required
            label="Phone"
            placeholder="Phone number"
            value={address.phone}
            onChange={handleChange}
            name={`${name}.phone`}
            style={{ flex: 3 }}
          />
          <TextInput
            required
            label="Email"
            placeholder="Email address"
            value={address.email}
            onChange={handleChange}
            name={`${name}.email`}
            style={{ flex: 4 }}
          />
        </Group>
      </Stack>
    </Stack>
  )
}

export default Address
