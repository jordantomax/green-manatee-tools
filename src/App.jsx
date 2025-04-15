import React from 'react'
import {
  AuthProvider,
  AuthConsumer,
  AuthContext
} from './contexts/Auth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MantineProvider, AppShell } from '@mantine/core'

import { theme } from './utils/theme'
import Auth from './views/Auth'
import Nav from './components/Nav'
import Postage from './views/Postage'
import Inventory from './views/Inventory'
import Shipping from './views/Shipping'

function AppContent() {
  const auth = React.useContext(AuthContext)

  if (auth.isLoggedIn === null) {
    return <div>Loading...</div>
  }

  if (!auth.isLoggedIn) {
    return <Auth />
  }

  return (
    <AppShell
      navbar={{ width: 200, breakpoint: 'sm' }}
      padding="md"
      styles={{
        main: {
          backgroundColor: 'var(--mantine-color-gray-0)',
          minHeight: '100vh'
        }
      }}
    >
      <Nav />
      <AppShell.Main>
        <Routes>
          <Route path='/' element={<Navigate to="/postage" replace />} />
          <Route path='postage' element={<Postage />} />
          <Route path='shipping' element={<Shipping />} />
          <Route path='inventory' element={<Inventory />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  )
}

export default function App () {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
