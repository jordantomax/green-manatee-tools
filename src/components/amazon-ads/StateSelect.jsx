import { Select, Loader } from '@mantine/core'
import isFunction from 'lodash-es/isFunction'
import useConfirm from '@/hooks/useConfirm'
import { TARGET_STATES } from '@/utils/constants'

const StateSelect = ({ value, onChange, isLoading }) => {
  const confirm = useConfirm()

  const handleChange = async (newState) => {
    if (newState === value) return
    
    if (newState === TARGET_STATES.ARCHIVED) {
      const confirmed = await confirm({
        title: 'Archive Item',
        message: 'Are you sure? Archiving cannot be undone.',
        confirmText: 'Archive',
        confirmColor: 'red'
      })
      
      if (!confirmed) return
    }
    
    isFunction(onChange) && onChange(newState)
  }

  return (
    <Select
      size="xs"
      radius="xl"
      variant="filled"
      value={value}
      onChange={handleChange}
      disabled={isLoading || value === TARGET_STATES.ARCHIVED}
      rightSection={isLoading ? <Loader size="xs" /> : null}
      data={[
        { value: TARGET_STATES.ENABLED, label: 'Enabled' },
        { value: TARGET_STATES.PAUSED, label: 'Paused' },
        { value: TARGET_STATES.ARCHIVED, label: 'Archived' }
      ]}
      styles={{ 
        wrapper: { width: 120 },
        dropdown: { width: 120 } 
      }}
    />
  )
}

export default StateSelect