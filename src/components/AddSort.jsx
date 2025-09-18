import { Group } from '@mantine/core'
import { IconArrowsSort } from '@tabler/icons-react'
import startCase from 'lodash-es/startCase'

import SearchableSelect from '@/components/SearchableSelect'

const AddSort = ({ columns, handleSortAdd }) => {
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

export default AddSort
