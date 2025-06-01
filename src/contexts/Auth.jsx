import React, { useState, useEffect, createContext, useRef } from 'react'
import {
  getSavedTokens,
  setSavedTokens,
  removeSavedTokens
} from '@/utils/auth'
import api, { setTokensHandler } from '@/utils/api'

export const AuthContext = createContext({
  isLoggedIn: null,
  user: null,
  logIn: (email, password) => {},
  signUp: (email, password) => {},
  logOut: () => {},
  refreshToken: () => {}
})

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [user, setUser] = useState(null)
  const hasFetchedUser = useRef(false)

  const saveTokens = async (data) => {
    await setSavedTokens({
      access: data.accessToken,
      refresh: data.refreshToken
    })
  }

  setTokensHandler(saveTokens)
  
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
    if (!hasFetchedUser.current) {
      hasFetchedUser.current = true
      getUser()
    }
  }, [])

  const logIn = async (email, password) => {
    const data = await api.login(email, password)
    await saveTokens(data)
    setUser(data.user)
    setIsLoggedIn(true)
  }
  
  const signUp = async (email, password, apiKey) => {
    return await api.signUp(email, password, apiKey)
  }

  const logOut = async () => {
    removeSavedTokens()
    setIsLoggedIn(false)
    setUser(null)
  }

  const refreshToken = async () => {
    const data = await api.refreshToken()
    console.log("tokens data: ", data)
    await saveTokens(data)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        user: user,
        logIn: logIn,
        signUp: signUp,
        logOut: logOut,
        refreshToken: refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer