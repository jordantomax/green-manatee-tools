import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { ModalContext } from '../ModalContext'

const TestComponent = () => {
  const { showModal, hideModal } = useContext(ModalContext)
  
  const TestContent = ({ onClose }) => (
    <div>
      <p>Test content</p>
      <button onClick={onClose}>Close</button>
    </div>
  )

  return (
    <div>
      <button onClick={() => showModal({ title: 'Test Modal', content: TestContent })}>
        Show Modal
      </button>
      <button onClick={hideModal}>Hide Modal</button>
    </div>
  )
}

const setup = () => {
  renderWithProviders(<TestComponent />)
}

describe('ModalContext', () => {

  describe('Show Modal', () => {
    it('Shows modal with correct title and content', async () => {
      setup()

      const showButton = screen.getByText('Show Modal')
      fireEvent.click(showButton)

      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveTextContent('Test Modal')
      })
    })
  })

  describe('Hide Modal', () => {
    it('Hides the modal', async () => {
      setup()

      const showButton = screen.getByText('Show Modal')
      fireEvent.click(showButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const closeButton = screen.getByText('Close')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })
})
