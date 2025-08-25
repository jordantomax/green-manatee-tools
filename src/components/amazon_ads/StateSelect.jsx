import { Select, Loader } from '@mantine/core'
import isFunction from 'lodash-es/isFunction'

const StateSelect = ({ value, onChange, isLoading }) => {
  const handleChange = (newState) => {
    if (newState === value) return
    isFunction(onChange) && onChange(newState)
  }

  return (
    <Select
      size="xs"
      radius="xl"
      variant="filled"
      value={value}
      onChange={handleChange}
      disabled={isLoading}
      rightSection={isLoading ? <Loader size="xs" /> : null}
      data={[
        { value: 'ENABLED', label: 'Enabled' },
        { value: 'PAUSED', label: 'Paused' },
        { value: 'ARCHIVED', label: 'Archived' }
      ]}
      styles={{ 
        wrapper: { width: 120 },
        dropdown: { width: 120 } 
      }}
    />
  )
}

export default StateSelect