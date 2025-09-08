import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import StateSelect from '../StateSelect'

const setup = (props = {}) => {
  const defaultProps = {
    value: 'ENABLED',
    onChange: vi.fn(),
    isLoading: false,
    ...props
  }
  
  renderWithProviders(<StateSelect {...defaultProps} />)
}

describe('StateSelect', () => {

  describe('when changing to ARCHIVED', () => {
    it('shows confirmation modal with correct content and styling', async () => {
      const onChange = vi.fn()
      setup({ onChange })

      const select = screen.getByRole('textbox')
      fireEvent.click(select)

      const archivedOption = screen.getByText('Archived')
      fireEvent.click(archivedOption)

      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveTextContent('Archive')
      })
    })
  })

  describe('when value is ARCHIVED', () => {
    it('disables the select', () => {
      setup({ value: 'ARCHIVED' })

      const select = screen.getByRole('textbox')
      expect(select).toBeDisabled()
    })
  })
})
