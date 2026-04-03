const API_BASE = '/api/marketing/auth'

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
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

export const getStoredToken = () => {
  return localStorage.getItem('auth_token')
}

export const getStoredUser = () => {
  const user = localStorage.getItem('auth_user')
  return user ? JSON.parse(user) : null
}

export const storeAuth = (token, user) => {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_user', JSON.stringify(user))
}
