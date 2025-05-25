import React, { useState, useEffect } from 'react'
import { Button, Combobox, useCombobox, ActionIcon, Tooltip, Box } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

function SearchableSelect({ 
  label, 
  options, 
  onSelect, 
  onRefresh,
  isLoading,
  placeholder = "Search...",
  width = 250,
  buttonProps = {}
}) {
  const [search, setSearch] = useState('')
  const [filteredOptions, setFilteredOptions] = useState([])
  const [hasRefreshed, setHasRefreshed] = useState(false)

  useEffect(() => {
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(search.toLowerCase().trim())
    )
    setFilteredOptions(filtered)
  }, [options, search])

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch('')
    },
    onDropdownOpen: () => {
      if (!hasRefreshed && onRefresh) {
        onRefresh()
        setHasRefreshed(true)
      }
      combobox.focusSearchInput()
    }
  })

  return (
    <Combobox
      store={combobox}
      width={width}
      position="bottom-start"
      withArrow
      onOptionSubmit={value => {
        combobox.closeDropdown()
        onSelect(value)
      }}
    >
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="light"
          disabled={isLoading}
          loading={isLoading}
          onClick={combobox.toggleDropdown}
          {...buttonProps}
        >
          {label}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Box style={{ position: 'relative' }}>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder={placeholder}
          />
          {onRefresh && (
            <Tooltip label="Refresh options">
              <ActionIcon 
                variant="subtle" 
                color="blue" 
                onClick={onRefresh}
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
          )}
        </Box>
        <Combobox.Options style={{ maxHeight: 200, overflowY: 'auto' }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <Combobox.Option 
                value={option.value} 
                key={option.value}
                onClick={() => combobox.selectOption(option.value)}
              >
                {option.label}
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default SearchableSelect 