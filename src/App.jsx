import React, { useEffect } from 'react'
import {
  AuthProvider,
  AuthContext
} from '@/contexts/Auth'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

import Ads from '@/views/ads/Ads'
import AdsReport from '@/views/ads/AdsReport'
import AdsReports from '@/views/ads/AdsReports'
import AdsSearchTerm from '@/views/ads/AdsSearchTerm'
import AdsSearchTerms from '@/views/ads/AdsSearchTerms'
import Pricing from '@/views/Pricing'
import NotFound from '@/views/NotFound'

function AppContent() {
  const auth = React.useContext(AuthContext)
  const { showError } = useError()
  const location = useLocation()

  useEffect(() => {
    setErrorHandler(showError)
  }, [showError])

  const getMainBackgroundColor = () => {
    if (location.pathname.startsWith('/ads')) {
      return 'white'
    }
    return 'var(--mantine-color-gray-0)'
  }

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
    <AppShell>
      <Nav />
      <AppShell.Main style={{ backgroundColor: getMainBackgroundColor() }}>
        <Routes>
          <Route index path='/' element={<Navigate to="/postage" replace />} />
          <Route path='postage' element={<Postage />} />
          <Route path='shipping' element={<Shipping />} />
          <Route path='inventory' element={<Inventory />} />
          <Route path='ads/*' element={<Ads />}>
            <Route index element={<Navigate to="/ads/reports" replace />} />
            <Route path='reports' element={<AdsReports />} />
            <Route path='reports/:id' element={<AdsReport />} />
            <Route path='search-terms' element={<AdsSearchTerms />} />
            <Route path='search-terms/:searchTerm' element={<AdsSearchTerm />} />
          </Route>
          <Route path='pricing' element={<Pricing />} />
          <Route path='*' element={<NotFound />} />
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
