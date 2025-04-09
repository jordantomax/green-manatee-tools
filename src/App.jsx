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
import HeaderNav from './components/Nav'
import BuyPostage from './views/BuyPostage'
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
      <HeaderNav />
      <AppShell.Main>
        <Routes>
          <Route path='/' element={<Navigate to="/buy-postage" replace />} />
          <Route path='buy-postage' element={<BuyPostage />} />
          <Route path='shipping' element={<Shipping />} />
          <Route path='inventory-recommendations' element={<Inventory />} />
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
