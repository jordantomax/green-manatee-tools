import { useState, useEffect, useRef } from 'react'
import { Button, Group, Select, NumberInput, Box, Pill, Popover, Stack, TextInput, Text } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconFilter2 } from '@tabler/icons-react'
import isEmpty from 'lodash-es/isEmpty'
import startCase from 'lodash-es/startCase'

import { conditionLabels } from '@/utils/table'
import SearchableSelect from '@/components/SearchableSelect'
import styles from '@/styles/TableFilter.module.css'

export const AddFilter = ({ columns, handleFilterAdd }) => {
  if (!columns) return null

  return (
    <Group>
      <SearchableSelect
        label={<IconFilter2 size={20} />}
        options={columns.map(column => ({
          value: column,
          label: startCase(column),
        }))}
        onSelect={handleFilterAdd}
        placeholder="Filter columns..."
        buttonProps={{
          p: 'xs',
        }}
      />
    </Group>
  )
}

const FilterInputComponents = {
  string: TextInput,
  id: TextInput,
  integer: NumberInput,
  float: NumberInput,
  currency: NumberInput,
  date: DateInput,
  boolean: Select,
}

const ActiveFilter = ({ filter, handleFilterRemove, handleFilterChange, isNewlyAdded }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [condition, setCondition] = useState(filter.condition)
  const [value, setValue] = useState(filter.value)
  const FilterInput = FilterInputComponents[filter.type] || TextInput
  
  const handleSave = () => {
    handleFilterChange(filter.id, condition, value)
    setIsOpen(false)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    handleSave()
  }

  useEffect(() => {
    if (isNewlyAdded) {
      setIsOpen(true)
    }
  }, [isNewlyAdded])
  
  return (
    <Popover 
      returnFocus
      trapFocus
      closeOnEscape
      closeOnClickOutside={false}
      opened={isOpen} 
      onDismiss={() => setIsOpen(false)}
      position="bottom-start"
    >
      <Popover.Target>
        <Box onClick={() => setIsOpen(!isOpen)}>
          <Pill 
            size="sm"
            withRemoveButton 
            onRemove={() => handleFilterRemove(filter.id)}
            classNames={{
              root: styles.tableFilterPill,
              remove: styles.removeButton,
            }}
          >
            {filter.column} {filter.condition} {filter.value || "''"}
          </Pill>
        </Box>
      </Popover.Target>

      <Popover.Dropdown>
        <form onSubmit={handleFormSubmit}>
          <Stack gap="xs">
            <Select 
              size="xs"
              value={condition}
              onChange={setCondition}
              data={filter.conditionOptions.map(option => ({
                value: option,
                label: conditionLabels[option]
              }))}
              style={{ maxWidth: '200px' }}
            />
            
            <FilterInput
              size="xs"
              placeholder={filter.value}
              value={value}
              onChange={(newValue) => {
                if (filter.type === 'string' || filter.type === 'id') {
                  setValue(newValue.target.value)
                } else {
                  setValue(newValue)
                }
              }}
              style={{ maxWidth: '200px' }}
            />

            <Group gap="xs" justify="center">
              <Button 
                type="submit"
                size="compact-xs"
                variant="white"
                children="Save"
              />
              <Button 
                type="button"
                size="compact-xs" 
                variant="white"
                onClick={() => setIsOpen(false)}
                children="Cancel"
              />
            </Group>
          </Stack>
        </form>
      </Popover.Dropdown>
    </Popover>
  )
}

export const ActiveFilters = ({ filters, handleFilterRemove, handleFilterChange }) => {
  const prevFilterCount = useRef(filters.length)
  const isNewlyAdded = filters.length > prevFilterCount.current
  
  useEffect(() => {
    prevFilterCount.current = filters.length
  }, [filters.length])

  if (isEmpty(filters)) return null

  return (
    <Group gap="xs">
      <Text size="xs" fw={500}>Filters</Text>

      {filters.map((filter, index) => (
        <ActiveFilter 
          key={index} 
          filter={filter} 
          handleFilterRemove={handleFilterRemove} 
          handleFilterChange={handleFilterChange}
          isNewlyAdded={isNewlyAdded && index === filters.length - 1}
        />
      ))}
    </Group>
  )
}