import React, { useState, useEffect } from 'react'
import { Button, Stack, TextInput, Group, Title, Combobox, useCombobox, ActionIcon, Tooltip, Box } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

import { setLocalData, getLocalData } from '@/utils/storage'
import api from '@/utils/api'

function Address ({ address, name, handleChange, label }) {
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState(null)
  const [options, setOptions] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (locations) {
      const newOptions = locations
        .filter(location => 
          location.properties.name.value.toLowerCase().includes(search.toLowerCase().trim())
        )
        .map((location) => {
          const locationName = location.properties.name.value
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

  async function getLocations(forceUpdate = false) {
    let locations = getLocalData('locations')
    setIsLoading(true)
    if (!locations || forceUpdate) {
      locations = await api.queryResources('locations', {
        filter_properties: ['name'],
        filter_value: search
      })
    }
    setIsLoading(false)
    setLocalData('locations', locations)
    setLocations(locations)
  }
  
  async function handleSelect(location) {
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
        const value = p[field].value
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
            <Box style={{ position: 'relative' }}>
              <Combobox.Search
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search locations"
              />
              <Tooltip label="Force refresh locations">
                <ActionIcon 
                  variant="subtle" 
                  color="blue" 
                  onClick={() => getLocations(true)}
                  loading={isLoading}
                  style={{ 
                    position: 'absolute', 
                    right: 5, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
            </Box>
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