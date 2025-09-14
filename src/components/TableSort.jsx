import { useState } from 'react'
import { Button, Group, Select, Box, Pill, Popover, Stack, Text } from '@mantine/core'
import { IconArrowsSort } from '@tabler/icons-react'
import startCase from 'lodash-es/startCase'

import { sortDirections, columnTypes } from '@/utils/table'
import SearchableSelect from '@/components/SearchableSelect'
import styles from '@/styles/TableFilter.module.css'

export const AddSort = ({ columns, handleSortAdd }) => {
  if (!columns) return null

  return (
    <Group>
      <SearchableSelect
        label={<IconArrowsSort size={21} />}
        options={columns.map(column => ({
          value: column,
          label: startCase(column),
        }))}
        onSelect={handleSortAdd}
        placeholder="Sort columns..."
        buttonProps={{
          p: 'xs',
        }}
      />
    </Group>
  )
}

const ActiveSort = ({ sort, handleSortRemove, handleSortChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [column, setColumn] = useState(sort.column)
  const [direction, setDirection] = useState(sort.direction)
  
  const handleSave = () => {
    handleSortChange(sort.id, column, direction)
    setIsEditing(false)
  }
  
  return (
    <Popover opened={isEditing} onClose={() => setIsEditing(false)}>
      <Popover.Target>
        <Box onClick={() => setIsEditing(!isEditing)}>
          <Pill 
            size="sm"
            withRemoveButton 
            onRemove={() => handleSortRemove(sort.id)}
            classNames={{
              root: styles.tableFilterPill,
              remove: styles.removeButton,
            }}
          >
            {sort.column} ({sort.direction})
          </Pill>
        </Box>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="xs">
          <Select 
            size="xs"
            label="Column"
            value={column}
            onChange={setColumn}
            data={Object.keys(columnTypes).map(col => ({
              value: col,
              label: startCase(col)
            }))}
            style={{ maxWidth: '200px' }}
          />
          
          <Select
            size="xs"
            label="Direction"
            value={direction}
            onChange={setDirection}
            data={Object.entries(sortDirections).map(([key, label]) => ({
              value: key,
              label: startCase(label)
            }))}
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

export const ActiveSorts = ({ sorts, handleSortRemove, handleSortChange }) => {
  if (!sorts || sorts.length === 0) return null

  return (
    <Group gap="xs">
      <Text size="xs" fw={500}>Sorts</Text>

      {sorts.map((sort, index) => (
        <ActiveSort 
          key={sort.id} 
          sort={sort} 
          handleSortRemove={handleSortRemove} 
          handleSortChange={handleSortChange} 
        />
      ))}
    </Group>
  )
}
