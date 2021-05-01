import React from 'react'
import {
  AuthProvider,
  AuthConsumer
} from './context/Auth'

import Home from './views/Home'
import Auth from './views/Auth'

export default function App () {
  return (
    <AuthProvider>
      <AuthConsumer>
        {({ isLoggedIn }) => {
          if (isLoggedIn === null) {
            return <div>Loading...</div>
          }
          return isLoggedIn ? <Home /> : <Auth />
        }}
      </AuthConsumer>
    </AuthProvider>
  )
}
