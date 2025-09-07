import React from 'react'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { ModalProvider } from '@/contexts/ModalContext'
import { ErrorProvider } from '@/contexts/Error'
import { theme } from '@/utils/theme'

const renderWithProviders = (ui, options = {}) => {
  return render(
    <MantineProvider theme={theme}>
      <ErrorProvider>
        <ModalProvider>
          {ui}
        </ModalProvider>
      </ErrorProvider>
    </MantineProvider>,
    options
  )
}

export default renderWithProviders
