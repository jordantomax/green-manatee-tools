import React, { useState, useEffect } from 'react'
import { Button, Stack, TextInput, Group, Paper, Title, Combobox, useCombobox } from '@mantine/core'

import { NOTION_LOCATIONS_DB_ID } from '../constants'
import { getNotionProp } from '../utils/notion'
import api from '../utils/api'

function Address ({ address, name, handleChange, label }) {
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState(null)
  const [options, setOptions] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (locations) {
      const newOptions = locations
        .filter(location => 
          getNotionProp(location.properties.name).toLowerCase().includes(search.toLowerCase().trim())
        )
        .map((location) => {
          const locationName = getNotionProp(location.properties.name)
          return (
            <Combobox.Option 
              value={location.id} 
              key={location.id}
              onClick={() => combobox.selectOption(location.id)}
            >
              {locationName}
            </Combobox.Option>
          )
        })
      setOptions(newOptions)
    }
  }, [locations, search])

  async function getLocations() {
    setIsLoading(true)
    const locations = await api.notionQueryDatabase(NOTION_LOCATIONS_DB_ID, {
      filter_properties: ['name'],
      filter_value: search
    })
    setIsLoading(false)
    setLocations(locations)
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
  
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch('')
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput()
      getLocations()
    },
    
  })
  
 return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2} style={{ margin: 0 }}>{label}</Title>
    
        <Combobox
          store={combobox}
          width={250}
          position="bottom-start"
          withArrow
          onOptionSubmit={locationId => {
            combobox.closeDropdown()
            const selectedLocation = locations.find(location => location.id === locationId)
            if (selectedLocation) { handleSelect(selectedLocation) }
          }}
        >
          <Combobox.Target withAriaAttributes={false}>
            <Button
              variant="light"
              disabled={isLoading}
              loading={isLoading}
              onClick={combobox.toggleDropdown}
            >
              Search Locations 
            </Button>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Search
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search locations"
            />
            <Combobox.Options style={{ maxHeight: 200, overflowY: 'auto' }}>
              {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
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
