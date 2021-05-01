import React, { useState, useEffect, createContext } from 'react'

import {
  getSavedToken,
  setSavedToken,
  removeSavedToken
} from '../utils/auth'

export const AuthContext = createContext({
  token: null,
  isLoggedIn: null,
  logIn: () => {},
  logOut: () => {}
})

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    (async function () {
      const token = await getSavedToken()
      setTokens(token)
      setIsLoggedIn(!!token)
    })()
  }, [])

  const setTokens = (token) => {
    setToken(token)
    setSavedToken(token)
  }

  const logIn = async (token) => {
    await setTokens(token)
    setIsLoggedIn(true)
  }

  const logOut = async () => {
    setToken(null)
    removeSavedToken()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{
        token: token,
        isLoggedIn: isLoggedIn,
        logIn: logIn,
        logOut: logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
