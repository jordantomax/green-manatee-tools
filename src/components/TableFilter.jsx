import { useState } from 'react'
import { Button, Group, Text, Select, NumberInput, Box, Pill, Popover, Stack, TextInput } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DateInput } from '@mantine/dates'
import isEmpty from 'lodash-es/isEmpty'
import startCase from 'lodash-es/startCase'

import { createDefaultFilter, conditionLabels } from '@/utils/table'
import SearchableSelect from '@/components/SearchableSelect'
import styles from '@/styles/TableFilter.module.css'

export const AddFilter = ({ columns, handleFilterAdd }) => {
  const handleSelect = (column) => {
    const filter = createDefaultFilter(column)
    handleFilterAdd(filter)
  }
  
  if (!columns) return null

  return (
    <Group>
      <SearchableSelect
        label="Add Filter"
        options={columns.map(column => ({
          value: column,
          label: startCase(column),
        }))}
        onSelect={handleSelect}
        placeholder="Search columns..."
        width={300}
        buttonProps={{
          variant: 'light',
        }}
      />
    </Group>
  )
}

const FilterInputComponents = {
  string: TextInput,
  id: TextInput,
  number: NumberInput,
  date: DateInput,
  boolean: Select,
}

const ActiveFilter = ({ filter, handleFilterRemove, handleFilterChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [condition, setCondition] = useState(filter.condition)
  const [value, setValue] = useState(filter.value)
  const FilterInput = FilterInputComponents[filter.type] || TextInput
  
  const handleSave = () => {
    handleFilterChange(filter, condition, value)
    setIsEditing(false)
  }
  
  return (
    <Popover opened={isEditing} onClose={() => setIsEditing(false)}>
      <Popover.Target>
        <Box onClick={() => setIsEditing(!isEditing)}>
          <Pill 
            withRemoveButton 
            onRemove={() => handleFilterRemove(filter)}
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
            placeholder={filter.type}
            value={value}
            onChange={setValue}
            style={{ maxWidth: '200px' }}
          />

          <Group gap="xs" justify="center">
            <Button 
              size="compact-xs"
              variant="white"
              onClick={handleSave}
              children="Save"
            />
            <Button 
              size="compact-xs" 
              variant="white"
              onClick={() => setIsEditing(false)}
              children="Cancel"
            />
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export const ActiveFilters = ({ filters, handleFilterRemove, handleFilterChange }) => {
  if (isEmpty(filters)) return null

  return (
    <Group>
      {filters.map((filter, index) => (
        <ActiveFilter 
          key={index} 
          filter={filter} 
          handleFilterRemove={handleFilterRemove} 
          handleFilterChange={handleFilterChange} 
        />
      ))}
    </Group>
  )
}