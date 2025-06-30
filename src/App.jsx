import React, { useEffect } from 'react'
import {
  AuthProvider,
  AuthContext
} from '@/contexts/Auth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MantineProvider, AppShell } from '@mantine/core'

import { theme } from '@/utils/theme'
import { ErrorProvider, useError } from '@/contexts/Error'
import { setErrorHandler } from '@/utils/api'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import Nav from '@/components/Nav'
import Postage from '@/views/Postage'
import Inventory from '@/views/Inventory'
import Shipping from '@/views/Shipping'
import Ads from '@/views/Ads'
import AdsReport from '@/views/AdsReport'
import Pricing from '@/views/Pricing'

function AppContent() {
  const auth = React.useContext(AuthContext)
  const { showError } = useError()

  useEffect(() => {
    setErrorHandler(showError)
  }, [showError])

  if (auth.isLoggedIn === null) {
    return <div>Loading...</div>
  }

  if (!auth.isLoggedIn) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <AppShell
      navbar={{ width: 200, breakpoint: 'sm' }}
      padding="md"
      styles={{
        main: {
          backgroundColor: 'var(--mantine-color-gray-0)'
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
          <Route path='ads' element={<Ads />} />
          <Route path='ads/:id' element={<AdsReport />} />
          <Route path='pricing' element={<Pricing />} />
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
          <ErrorProvider>
            <AppContent />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
