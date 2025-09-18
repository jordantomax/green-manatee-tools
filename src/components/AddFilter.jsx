import { Group } from '@mantine/core'
import { IconFilter2 } from '@tabler/icons-react'
import startCase from 'lodash-es/startCase'

import SearchableSelect from '@/components/SearchableSelect'

const AddFilter = ({ columns, handleFilterAdd }) => {
  if (!columns) return null

  return (
    <Group>
      <SearchableSelect
        label={<IconFilter2 size={21} />}
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
export default AddFilter

