import React, { useState, useMemo } from 'react'
import { Button, Combobox, useCombobox, Checkbox, Box } from '@mantine/core'

function SearchableMultiSelect({ 
  label, 
  options, 
  selectedValues = [],
  onSelectionChange,
  placeholder = "Search...",
  width = 250,
  buttonProps = {},
  groupOptionsFn
}) {
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.label.toLowerCase().includes(search.toLowerCase().trim())
    )
  }, [options, search])

  const groupedOptions = useMemo(() => {
    if (groupOptionsFn) {
      return groupOptionsFn(filteredOptions, selectedValues)
    }
    return null
  }, [filteredOptions, selectedValues, groupOptionsFn])

  const allSelected = options.length > 0 && options.every(opt => selectedValues.includes(opt.value))

  const handleToggle = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelection)
  }
  
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(options.map(opt => opt.value))
    }
  }

  const Option = ({ option }) => (
    <Combobox.Option 
      value={option.value} 
      key={option.value}
    >
      <Checkbox
        checked={selectedValues.includes(option.value)}
        label={option.label}
        onChange={(e) => {
          e.stopPropagation()
          handleToggle(option.value)
        }}

      />
    </Combobox.Option>
  )

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch('')
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput()
    }
  })
  
  return (
    <Combobox
      store={combobox}
      width={width}
      withArrow={false}
    >
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="light"
          onClick={combobox.toggleDropdown}
          {...buttonProps}
        >
          {label}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={placeholder}
        />
        <Combobox.Options>
          {filteredOptions.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            <>
              <Combobox.Option 
                value="__select_all__"
              >
                <Checkbox
                  onChange={(e) => {
                    e.stopPropagation()
                    handleSelectAll()
                  }}
                  checked={allSelected}
                  label={allSelected ? 'Deselect All' : 'Select All'}
                />
              </Combobox.Option>
              {groupedOptions?.length > 0 ? (
                groupedOptions.map((group, groupIdx) => (
                  <Combobox.Group key={groupIdx} label={group.label}>
                    {group.items.map(option => (
                      <Option key={option.value} option={option} />
                    ))}
                  </Combobox.Group>
                ))
              ) : (
                filteredOptions.map(option => (
                  <Option key={option.value} option={option} />
                ))
              )}
            </>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default SearchableMultiSelect

