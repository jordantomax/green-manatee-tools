import { describe, it, expect } from 'vitest'
import renderWithProviders from '@/test-utils/renderWithProviders'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
    expect(document.body).toBeInTheDocument()
  })
})
