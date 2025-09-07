import React, { createContext, useState } from 'react'

export const ModalContext = createContext()

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([])

  const showModal = (modal) => {
    const id = Date.now() + Math.random()
    setModals(prev => [...prev, { id, ...modal }])
    return id
  }

  const hideModal = (id) => {
    setModals(prev => prev.filter(modal => modal.id !== id))
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modals }}>
      {children}
      {modals.map(modal => (
        <modal.component
          key={modal.id}
          {...modal.props}
          onClose={() => hideModal(modal.id)}
        />
      ))}
    </ModalContext.Provider>
  )
}

