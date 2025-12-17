import { IconEye } from '@tabler/icons-react'
import startCase from 'lodash-es/startCase'
import SearchableMultiSelect from '@/components/SearchableMultiSelect'

const ColumnVisibility = ({ columns, hiddenColumns = [], onColumnsChange }) => {
  if (!columns || columns.length === 0) return null

  const options = columns.map(column => ({
    value: column,
    label: startCase(column),
  }))

  const selectedValues = columns.filter(col => !hiddenColumns.includes(col))

  const groupOptionsFn = (filteredOptions, selected) => {
    const visible = filteredOptions.filter(opt => selected.includes(opt.value))
    const hidden = filteredOptions.filter(opt => !selected.includes(opt.value))
    
    return [
      ...(visible.length > 0 ? [{ label: 'Visible', items: visible }] : []),
      ...(hidden.length > 0 ? [{ label: 'Hidden', items: hidden }] : [])
    ]
  }

  const handleSelectionChange = (selectedValues) => {
    const newHiddenColumns = columns.filter(col => !selectedValues.includes(col))
    onColumnsChange(newHiddenColumns)
  }

  return (
    <SearchableMultiSelect
      label={<IconEye size={21} />}
      options={options}
      selectedValues={selectedValues}
      onSelectionChange={handleSelectionChange}
      placeholder="Search columns..."
      groupOptionsFn={groupOptionsFn}
      buttonProps={{
        p: 'xs',
      }}
    />
  )
}

export default ColumnVisibility