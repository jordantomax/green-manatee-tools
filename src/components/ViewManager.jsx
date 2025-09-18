import React, { useState, useEffect, useRef } from 'react'
import { Button, Group, Tabs, Tooltip, TextInput, Loader } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import styles from '@/styles/ViewManager.module.css'

export default function ViewManager({ 
  views = [],
  activeViewId,
  filters = [], 
  sorts = [], 
  onViewLoad,
  viewHandlers,
  isLoading = false
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')
  const inputRef = useRef(null)
  
  const handleTabChange = (value) => {
    viewHandlers.setActive(value)
    onViewLoad?.(views.find(view => view.id === value))
  }

  const handleCreateView = () => {
    viewHandlers.create()
  }

  const handleStartEdit = (currentName) => {
    setIsEditing(true)
    setEditingName(currentName)
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSaveEdit = async () => {
    if (isEditing && activeViewId) {
      const trimmedName = editingName.trim()
      const currentView = views.find(view => String(view.id) === activeViewId)
      
      if (currentView && currentView.name !== trimmedName) {
        await viewHandlers.update(activeViewId, { name: trimmedName })
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
                >
                  {isEditing && activeViewId === id ? (
                    <TextInput
                      ref={inputRef}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      variant="unstyled"
                      autoFocus
                      classNames={{input: styles.editInput}}
                      rightSection={
                        isLoading ? <Loader size="xs" /> : null
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
          color="black"
          variant="transparent"
          size="sx"
          p="xs"
          onClick={handleCreateView}
          radius="50%"
          disabled={
            filters.length === 0 && sorts.length === 0 ||
            isLoading
          }
          classNames={{ root: styles.createButton }}
        >
          <IconPlus size={21} />
        </Button>
      </Tooltip>
    </Group>
  )
}
