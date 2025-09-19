import { useContext } from 'react'
import { ModalContext } from '@/contexts/ModalContext'
import ConfirmModal from '@/components/ConfirmModal'

export default function useConfirm() {
  const { showModal, hideModal } = useContext(ModalContext)
  if (!showModal) {
    throw new Error('useConfirm must be used within a ModalProvider')
  }

  const defaultOptions = {
    title: 'Confirm Action',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    confirmColor: 'blue'
  }

  const confirm = (options) => {
    return new Promise((resolve) => {
      const mergedOptions = { ...defaultOptions, ...options }
      
      const handleConfirm = (result) => {
        resolve(result)
        hideModal()
      }

      showModal({
        title: mergedOptions.title,
        content: ConfirmModal,
        props: {
          onConfirm: handleConfirm,
          message: mergedOptions.message,
          confirmText: mergedOptions.confirmText,
          confirmColor: mergedOptions.confirmColor
        }
      })
    })
  }

  return confirm
}