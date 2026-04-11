const API_BASE = '/api/marketing/auth'
const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

const parseErrorResponse = async (response) => {
  try {
    const data = await response.json()

    // Handle validation errors
    if (data.errors && Array.isArray(data.errors)) {
      const errorMessages = data.errors.map(e => e.message).join(', ')
      return errorMessages || data.message || 'Request failed'
    }

    return data.message || 'Request failed'
  } catch {
    return 'Request failed'
  }
}

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorMsg = await parseErrorResponse(response)
    throw new Error(errorMsg)
  }

  return response.json()
}

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const errorMsg = await parseErrorResponse(response)
    throw new Error(errorMsg)
  }

  return response.json()
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export const getStoredToken = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export const getStoredUser = () => {
  const user = sessionStorage.getItem(AUTH_USER_KEY)
  return user ? JSON.parse(user) : null
}

export const storeAuth = (token, user) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
