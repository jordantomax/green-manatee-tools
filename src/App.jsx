import React from 'react'
import {
  AuthProvider,
  AuthConsumer,
  AuthContext
} from './context/Auth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider, AppShell } from '@mantine/core'

import { theme } from './utils/theme'
import Auth from './views/Auth'
import HeaderNav from './components/Nav'
import Home from './views/Home'
import BuyPostage from './views/BuyPostage'
import OutboundEmail from './views/OutboundEmail'
import InboundEmail from './views/InboundEmail'
import BuildManifest from './views/BuildManifest'
import Inventory from './views/Inventory'

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
          <Route path='/' element={<Home />} />
          <Route path='buy-postage' element={<BuyPostage />} />
          <Route path='build-manifest' element={<BuildManifest />} />
          <Route path='inventory-recommendations' element={<Inventory />} />
          <Route path='outbound-email' element={<OutboundEmail />} />
          <Route path='inbound-email' element={<InboundEmail />} />
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
