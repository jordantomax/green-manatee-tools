import React, { useEffect } from 'react'
import {
  AuthProvider,
  AuthContext
} from '@/contexts/Auth'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MantineProvider, AppShell } from '@mantine/core'

import { theme } from '@/utils/theme'
import { NotificationProvider, useNotification } from '@/contexts/Notification'
import { ModalProvider } from '@/contexts/ModalContext'
import { setNotificationHandler } from '@/api'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import Nav from '@/components/Nav'
import Postage from '@/views/Postage'
import Inventory from '@/views/Inventory'
import Shipping from '@/views/Shipping'

import Ads from '@/views/ads/Ads'
import Report from '@/views/ads/Report'
import Reports from '@/views/ads/Reports'
import SearchTerm from '@/views/ads/SearchTerm'
import SearchTerms from '@/views/ads/SearchTerms'
import AdGroup from '@/views/ads/AdGroup'
import Pricing from '@/views/Pricing'
import NotFound from '@/views/NotFound'

function AppContent() {
  const auth = React.useContext(AuthContext)
  const { showNotification } = useNotification()
  const location = useLocation()

  useEffect(() => {
    setNotificationHandler(showNotification)
  }, [showNotification])

  const getMainBackgroundColor = () => {
    if (
      location.pathname.startsWith('/ads') || 
      location.pathname.startsWith('/inventory')
    ) {
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
            <Route index element={<Navigate to="/ads/search-terms" replace />} />
            <Route path='search-terms' element={<SearchTerms />} />
            <Route path='search-terms/:searchTerm' element={<SearchTerm />} />
            <Route path='ad-groups/:adGroupId' element={<AdGroup />} />
            <Route path='reports' element={<Reports />} />
            <Route path='reports/:id' element={<Report />} />
            <Route path='*' element={<NotFound />} />
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
          <NotificationProvider>
            <ModalProvider>
              <AppContent />
            </ModalProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
