import { Group, Text } from '@mantine/core'
import isEmpty from 'lodash-es/isEmpty'
import startCase from 'lodash-es/startCase'

import { createDefaultFilter } from '@/utils/table'
import SearchableSelect from '@/components/SearchableSelect'

export const AddFilter = ({ columns, handleAddFilter }) => {
  const handleSelect = (column) => {
    const filter = createDefaultFilter(column)
    handleAddFilter(filter)
  }
  
  if (!columns) return null

  return (
    <Group>
      <SearchableSelect
        label="Filter"
        options={columns.map(column => ({
          value: column,
          label: startCase(column)
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

export const ActiveFilters = ({ filters }) => {
  if (isEmpty(filters)) return null

  return (
    <Group>
      {filters.map(filter => (
        <Text key={filter.column}>
          {filter.column}
          {filter.condition}
          {filter.value}
        </Text>
      ))}
    </Group>
  )
}

        // {columns.map(columnname => {
        //   return (
        //     <group key={columnname} gap="xs" align="flex-end">
        //       <text size="sm" style={{ minwidth: 120 }}>{columnname}</text>
        //       
        //       <select
        //         size="xs"
        //         style={{ width: 100 }}
        //         value={filtertype}
        //         onchange={handlefiltertypechange}
        //         data={availablefilters.map(filter => ({ value: filter, label: filter }))}
        //       />
        //       
        //       {columntype === 'string' && (
        //         <textinput
        //           size="xs"
        //           style={{ width: 150 }}
        //           value={value}
        //           onchange={(e) => handlevaluechange(e.target.value)}
        //           placeholder="enter value..."
        //         />
        //       )}
        //       
        //       {columntype === 'number' && (
        //         <numberinput
        //           size="xs"
        //           style={{ width: 120 }}
        //           value={value}
        //           onchange={handlevaluechange}
        //           placeholder="enter value..."
        //         />
        //       )}
        //       
        //       {columntype === 'date' && (
        //         <dateinput
        //           size="xs"
        //           style={{ width: 150 }}
        //           value={value}
        //           onchange={handlevaluechange}
        //           placeholder="select date..."
        //         />
        //       )}
        //       
        //       {columntype === 'id' && (
        //         <textinput
        //           size="xs"
        //           style={{ width: 150 }}
        //           value={value}
        //           onchange={(e) => handlevaluechange(e.target.value)}
        //           placeholder="enter id..."
        //         />
        //       )}
        //     </group>
        //   )
        // })}