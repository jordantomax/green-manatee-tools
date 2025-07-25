import { Group, Text, Combobox, useCombobox, Button } from '@mantine/core'
import { getIndexedChartColor } from '@/utils/color'
import styles from '@/styles/Chart.module.css'
import { useState, useEffect } from 'react'

function Legend({ name, items, visibleItems, setVisibleItems }) {
  const [search, setSearch] = useState('')
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    const filtered = items.filter(item => 
      item.toLowerCase().includes(search.toLowerCase().trim())
    )
    setFilteredItems(filtered)
  }, [items, search])

  const handleToggle = (item) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(item)) {
        newSet.delete(item)
      } else {
        newSet.add(item)
      }
      return newSet
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
    }
  })

  return (
    <Combobox store={combobox}>
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="light"
          onClick={combobox.toggleDropdown}
        >
          {name} ({visibleItems.size}/{items.length})
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={`Search ${name}...`}
        />

        <Combobox.Options>
          {filteredItems.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            filteredItems.map(filteredItem => (
              <Combobox.Option 
                value={filteredItem} 
                key={filteredItem}
                onClick={() => handleToggle(filteredItem)}
              >
                <Group gap="xs">
                  <div
                    className={`
                      ${styles.legendIndicator}
                      ${!visibleItems.has(filteredItem) && styles.legendIndicatorHidden}
                    `}
                    style={{
                      '--indicator-color': getIndexedChartColor(items.indexOf(filteredItem))
                    }}
                  />
                  <Text size="sm">{filteredItem}</Text>
                </Group>
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default Legend 