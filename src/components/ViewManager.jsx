import React, { useState, useEffect, useRef } from 'react'
import { Button, Group, Tabs, Tooltip, TextInput, Loader, Menu, Box } from '@mantine/core'
import { IconPlus, IconDotsVertical } from '@tabler/icons-react'

import styles from '@/styles/ViewManager.module.css'
import useConfirm from '@/hooks/useConfirm'

export default function ViewManager({ 
  views = [],
  activeViewId,
  filters = [], 
  sorts = [], 
  viewHandlers,
  isLoading = false
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')
  const inputRef = useRef(null)
  const confirm = useConfirm()
  
  const handleTabChange = (value) => {
    viewHandlers.setActive(value)
  }

  const handleCreateView = () => {
    viewHandlers.create()
  }

  const handleStartEdit = (view) => {
    setIsEditing(true)
    setEditingName(view.name)
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

  const handleDelete = async (view) => {
    const confirmed = await confirm({
      title: `Delete "${view.name}"?`,
      message: null,
      confirmText: 'Delete',
      confirmColor: 'red'
    })
    if (!confirmed) return
    
    viewHandlers.delete(view.id)
  }
  
  return (
    <Group gap="xs">
      {views.length > 0 && activeViewId && (
        <Tabs 
          value={activeViewId} 
          onChange={handleTabChange}
          variant="outline"
        >
          <Tabs.List>
            {views.map((view) => {
              const isActive = activeViewId === view.id
              const id = String(view.id)
              const name = view.name

              return (
                <Tabs.Tab 
                  size="xs"
                  key={id} 
                  value={id}
                  onDoubleClick={() => isActive && handleStartEdit(view)}
                  classNames={{ tab: styles.tab, tabLabel: styles.tabLabel }}
                >
                  {isEditing && isActive ? (
                    <TextInput
                      ref={inputRef}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      variant="unstyled"
                      autoFocus
                      classNames={{input: styles.editInput}}
                    />
                  ) : (
                    <>
                      {name}
                    </>
                  )}

                  {isActive && (
                    <Menu position="bottom" disabled={isLoading}>
                      <Menu.Target>
                        <Box
                          className={styles.menuButton}
                          onClick={e => e.stopPropagation()}
                        >
                          <IconDotsVertical size={16} />
                        </Box>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item onClick={() => handleStartEdit(view)}>
                          Rename
                        </Menu.Item>

                        <Menu.Item onClick={() => handleDelete(view)} >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
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
