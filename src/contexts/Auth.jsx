import React, { useState, useEffect, createContext } from 'react'

import {
  getSavedTokens,
  setSavedTokens,
  removeSavedTokens
} from '@/utils/auth'

export const AuthContext = createContext({
  token: null,
  isLoggedIn: null,
  logIn: () => {},
  logOut: () => {}
})

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    (async function () {
      const tokens = await getSavedTokens()
      setAndSaveTokens(tokens)
      setIsLoggedIn(!!tokens)
    })()
  }, [])

  const setAndSaveTokens = (tokens) => {
    setTokens(tokens)
    setSavedTokens(tokens)
  }

  const logIn = async (tokens) => {
    setAndSaveTokens(tokens)
    setIsLoggedIn(true)
  }

  const logOut = async () => {
    setTokens(null)
    removeSavedTokens()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{
        tokens: tokens,
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
