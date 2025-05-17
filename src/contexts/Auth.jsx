import React, { useState, useEffect, createContext } from 'react'
import {
  getSavedTokens,
  setSavedTokens,
  removeSavedTokens
} from '@/utils/auth'
import api from '@/utils/api'

export const AuthContext = createContext({
  isLoggedIn: null,
  user: null,
  logIn: (email, password) => {},
  logOut: () => {},
  refreshToken: () => {}
})

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [user, setUser] = useState(null)

  const getUser = async () => {
    const tokens = await getSavedTokens()
    if (!tokens.access) {
      setIsLoggedIn(false)
      setUser(null)
      return
    }

    try {
      const userData = await api.getCurrentUser()
      setUser(userData)
      setIsLoggedIn(true)
    } catch (error) {
      removeSavedTokens()
      setIsLoggedIn(false)
      setUser(null)
      throw error
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const logIn = async (email, password) => {
    const data = await api.login(email, password)
    await setSavedTokens({
      access: data.accessToken,
      refresh: data.refreshToken
    })
    setUser(data.user)
    setIsLoggedIn(true)
  }

  const logOut = async () => {
    removeSavedTokens()
    setIsLoggedIn(false)
    setUser(null)
  }

  const refreshToken = async () => {
    const data = await api.refreshToken()
    await setSavedTokens({
      access: data.accessToken,
      refresh: data.refreshToken
    })
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        user: user,
        logIn: logIn,
        logOut: logOut,
        refreshToken: refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
