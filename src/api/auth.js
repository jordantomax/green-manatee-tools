import { call } from './core'

const API_URL = import.meta.env.VITE_API_URL

export async function login(email, password) {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function signUp(email, password, apiKey) {
  return call('auth/signup', {
    method: 'POST',
    body: {
      email,
      password,
      apiKey
    },
    headers: {
      'Signup-Api-Key': apiKey
    }
  })
}

export async function getCurrentUser() {
  return call('auth/me', {
    method: 'GET'
  })
}
