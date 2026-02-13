import React, { useState, useEffect } from 'react'
import { Stack, TextInput, Group, Title } from '@mantine/core'
import SearchableSelect from './SearchableSelect'
import { setLocalData, getLocalData } from '@/utils/storage'
import api from '@/api'

function Address ({ address, name, handleChange, label }) {
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState(null)
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (locations) {
      const newOptions = locations.map(location => ({
        value: location.id,
        label: location.properties.name.value
      }))
      setOptions(newOptions)
    }
  }, [locations])

  async function getLocations(forceUpdate = false) {
    let locations = getLocalData('locations')
    setIsLoading(true)
    if (!locations || forceUpdate) {
      locations = await api.queryResources('locations', {
        filter_properties: ['name'],
        filter_value: ''
      })
    }
    setIsLoading(false)
    setLocalData('locations', locations)
    setLocations(locations)
  }
  
  async function handleSelect(locationId) {
    const location = locations.find(l => l.id === locationId)
    if (!location) return

    const p = location.properties
    
    // First reset all fields to empty strings
    Object.keys(address).forEach(field => {
      handleChange({ 
        target: { 
          name: `${name}.${field}`, 
          value: '' 
        } 
      })
    })
    
    // Then update only the fields that have values in the location
    Object.keys(p)
      .filter(key => key !== 'id')
      .forEach(field => {
        const value = p[field]?.value
        if (value) {
          handleChange({ 
            target: { 
              name: `${name}.${field}`, 
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
    
        <SearchableSelect
          label="Search Locations"
          options={options}
          onSelect={handleSelect}
          onRefresh={() => getLocations(true)}
          isLoading={isLoading}
          placeholder="Search locations"
          width={250}
        />
      </Group>

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