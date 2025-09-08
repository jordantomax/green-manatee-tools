import React from 'react'
import { Button, Group, Text } from '@mantine/core'

const ConfirmModal = ({ 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText,
  confirmColor
}) => {
  const handleConfirm = () => {
    onConfirm(true)
    onClose()
  }

  const handleCancel = () => {
    onConfirm(false)
    onClose()
  }

  return (
    <>
      <Text mb="lg">{message}</Text>
      <Group justify="center">
        <Button variant="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button color={confirmColor} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </Group>
    </>
  )
}

export default ConfirmModal
