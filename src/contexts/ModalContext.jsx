import React, { createContext, useContext, useState } from 'react'
import ConfirmModal from '@/components/ConfirmModal'

export const ModalContext = createContext()

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    opened: false,
    message: '',
    resolver: null
  })

  const confirm = (message) => {
    return new Promise((resolve) => {
      setModalState({
        opened: true,
        message,
        resolver: resolve
      })
    })
  }

  const handleClose = () => {
    if (modalState.resolver) {
      modalState.resolver(false)
    }
    setModalState({
      opened: false,
      message: '',
      resolver: null
    })
  }

  const handleConfirm = (result) => {
    if (modalState.resolver) {
      modalState.resolver(result)
    }
    setModalState({
      opened: false,
      message: '',
      resolver: null
    })
  }

  return (
    <ModalContext.Provider value={{ confirm }}>
      {children}
      {modalState.opened && (
        <ConfirmModal
          opened={modalState.opened}
          onClose={handleClose}
          onConfirm={handleConfirm}
          message={modalState.message}
        />
      )}
    </ModalContext.Provider>
  )
}

