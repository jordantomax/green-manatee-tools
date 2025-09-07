import React, { createContext, useState } from 'react'
import { Modal } from '@mantine/core'

export const ModalContext = createContext()

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    opened: false,
    title: '',
    content: null,
    props: {}
  })

  const showModal = (modal) => {
    setModalState({
      opened: true,
      title: modal.title || '',
      content: modal.content,
      props: modal.props || {}
    })
  }

  const hideModal = () => {
    setModalState({
      opened: false,
      title: '',
      content: null,
      props: {}
    })
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        opened={modalState.opened}
        onClose={hideModal}
        title={modalState.title}
        size="sm"
      >
        {modalState.content ? (
          <modalState.content
            {...modalState.props}
            onClose={hideModal}
          />
        ) : (
          <div>No content</div>
        )}
      </Modal>
    </ModalContext.Provider>
  )
}

