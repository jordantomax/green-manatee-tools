import { useState } from 'react'
import { Button, Group, Tabs, Tooltip } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import api from '@/api'
import useAsync from '@/hooks/useAsync'

export default function ViewManager({ 
  resourceType, 
  currentFilters = [], 
  currentSorts = [], 
  onViewLoad 
}) {
  const [views, setViews] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  const { run, isLoading, loadingStates } = useAsync()

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const handleCreateView = async () => {
    await run(async () => await api.createView({
      name: 'New View',
      resourceType,
      filter: currentFilters,
      sort: currentSorts
    }), 'createView')
  }

  return (
    <Group gap="xs">
      {views.length > 0 && (
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            {views.map(view => (
              <Tabs.Tab key={view.id} value={view.id}>
                {view.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      )}

      <Tooltip label="New view">
        <Button
          color="gray"
          variant="subtle"
          size="sx"
          p="xs"
          onClick={handleCreateView}
          radius="50%"
          disabled={
            currentFilters.length === 0 && currentSorts.length === 0 ||
            loadingStates.createView
          }
        >
          <IconPlus size={21} />
        </Button>
      </Tooltip>
    </Group>
  )
}
