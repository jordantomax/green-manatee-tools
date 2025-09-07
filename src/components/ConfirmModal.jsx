import React from 'react'
import { Modal, Button, Group, Text } from '@mantine/core'

const ConfirmModal = ({ opened, onClose, onConfirm, message }) => {
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
      opened={opened}
      onClose={onClose}
      title="Confirm Action"
      size="sm"
      centered
    >
      <Text mb="lg">{message}</Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>
          Confirm
        </Button>
      </Group>
    </Modal>
  )
}

export default ConfirmModal
