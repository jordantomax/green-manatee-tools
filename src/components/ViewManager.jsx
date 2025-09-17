import React, { useState } from 'react'
import { Button, Group, Tabs, Tooltip, TextInput, Loader } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import useAsync from '@/hooks/useAsync'
import styles from '@/styles/ViewManager.module.css'

export default function ViewManager({ 
  views = [],
  activeViewId,
  currentFilters = [], 
  currentSorts = [], 
  onViewLoad,
  handlers
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')
  const { run, isLoading, loadingStates } = useAsync()

  const handleTabChange = (value) => {
    handlers.setActive(value)
    onViewLoad?.(views.find(view => view.id === value))
  }

  const handleCreateView = () => {
    run(() => handlers.create(), 'createView')
    handlers.load()
  }

  const handleStartEdit = (currentName) => {
    setIsEditing(true)
    setEditingName(currentName)
  }

  const handleSaveEdit = async () => {
    if (isEditing && activeViewId) {
      const trimmedName = editingName.trim()
      const currentView = views.find(view => String(view.id) === activeViewId)
      
      if (currentView && currentView.name !== trimmedName) {
        await run(() => handlers.update(activeViewId, { name: trimmedName }), 'updateView')
      }
    }
    setIsEditing(false)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingName('')
  }

  const handleKeyDown = (e) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }
  
  return (
    <Group gap="xs">
      {views.length > 0 && activeViewId && (
        <Tabs 
          value={activeViewId} 
          onChange={handleTabChange}
        >
          <Tabs.List>
            {views.map((view) => {
              const id = String(view.id)
              const name = view.name

              return (
                <Tabs.Tab 
                  key={id} 
                  value={id}
                  onDoubleClick={() => activeViewId === id && handleStartEdit(name)}
                  classNames={{ tab: styles.tab }}
                  style={{ 
                    cursor: activeViewId === id ? 'pointer' : 'default'
                  }}
                >
                  {isEditing && activeViewId === id ? (
                    <TextInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      variant="unstyled"
                      autoFocus
                      classNames={{input: styles.editInput}}
                      rightSection={
                        loadingStates.updateView ? <Loader size="xs" /> : null
                      }
                    />
                  ) : (
                    <>
                      {name}
                    </>
                  )}
                </Tabs.Tab>
              )
            })}
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
