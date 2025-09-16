import React, { useState, useEffect } from 'react'
import { Button, Group, Tabs, Tooltip } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import useAsync from '@/hooks/useAsync'
import useLocalStorage from '@/hooks/useLocalStorage'

export default function ViewManager({ 
  views = [],
  resourceType, 
  currentFilters = [], 
  currentSorts = [], 
  onViewLoad,
  handlers
}) {
  const [viewState, setViewState] = useLocalStorage(
    `viewManager-${resourceType}`, { activeViewId: null }
  )
  const { run, isLoading, loadingStates } = useAsync()

  useEffect(() => {
    if (views.length > 0 && !viewState.activeViewId) {
      setViewState('activeViewId', views[0].id)
    }
  }, [views, viewState.activeViewId, setViewState])

  const handleTabChange = (value) => {
    setViewState('activeViewId', value)
    onViewLoad?.(views.find(view => view.id === value))
  }

  const handleCreateView = () => {
    run(() => handlers.create(), 'createView')
  }
  
  return (
    <Group gap="xs">
      {views.length > 0 && viewState.activeViewId && (
        <Tabs value={String(viewState.activeViewId)} onChange={handleTabChange}>
          <Tabs.List>
            {views.map(({ id, name }) => (
              <Tabs.Tab key={id} value={String(id)}>
                {name}
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
