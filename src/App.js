import React from 'react'
import {
  AuthProvider,
  AuthConsumer
} from './context/Auth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Auth from './views/Auth'
import Home from './views/Home'
import BuyPostage from './views/BuyPostage'
import OutboundEmail from './views/OutboundEmail'
import InboundEmail from './views/InboundEmail'
import BuildManifest from './views/BuildManifest'

export default function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthConsumer>
          {({ isLoggedIn }) => {
            if (isLoggedIn === null) {
              return <div>Loading...</div>
            } else if (!isLoggedIn) {
              return <Auth />
            }

            return (
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='buy-postage' element={<BuyPostage />} />
                <Route path='build-manifest' element={<BuildManifest />} />
                <Route path='outbound-email' element={<OutboundEmail />} />
                <Route path='inbound-email' element={<InboundEmail />} />
              </Routes>
            )
          }}
        </AuthConsumer>
      </AuthProvider>
    </BrowserRouter>
  )
}
