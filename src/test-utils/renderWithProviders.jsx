import React from 'react'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { ModalProvider } from '@/contexts/ModalContext'
import { NotificationProvider } from '@/contexts/Notification'
import { theme } from '@/utils/theme'

const renderWithProviders = (ui, options = {}) => {
  return render(
    <MantineProvider theme={theme}>
      <NotificationProvider>
        <ModalProvider>
          {ui}
        </ModalProvider>
      </NotificationProvider>
    </MantineProvider>,
    options
  )
}

export default renderWithProviders
