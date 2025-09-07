import { useContext } from 'react'
import { ModalContext } from '@/contexts/ModalContext'
import ConfirmModal from '@/components/ConfirmModal'

export function useConfirm() {
  const { showModal } = useContext(ModalContext)
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
      
      showModal({
        component: ConfirmModal,
        props: {
          ...mergedOptions,
          onConfirm: (result) => {
            resolve(result)
          }
        }
      })
    })
  }

  return confirm
}
