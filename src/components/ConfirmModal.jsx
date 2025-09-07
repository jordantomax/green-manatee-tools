import React from 'react'
import { Modal, Button, Group, Text } from '@mantine/core'

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
    <Modal
      opened={true}
      onClose={onClose}
      title={title}
      size="sm"
      centered
    >
      <Text mb="lg">{message}</Text>
      <Group justify="center">
        <Button variant="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button color={confirmColor} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </Group>
    </Modal>
  )
}

export default ConfirmModal
