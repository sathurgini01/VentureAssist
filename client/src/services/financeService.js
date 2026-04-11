import { apiBase } from '../config/api.js'
const API_BASE = apiBase('/api/finance')

const getToken = () => sessionStorage.getItem('auth_token')

const parseError = async (response) => {
  try {
    const data = await response.json()
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((item) => item.message).join(', ')
    }
    return data?.message || 'Request failed'
  } catch {
    return 'Request failed'
  }
}

export async function getAllProfiles() {
  const token = getToken()
  if (!token) return []

  const response = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) return []
  return await response.json()
}

export async function getProfileById(id) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function createProfile(data) {
  const token = getToken()
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function updateProfile(id, data) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function deleteProfile(id) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error(await parseError(response))
  return true
}

export async function getBreakEven(id) {
  const response = await fetch(`${API_BASE}/breakeven/${id}`)
  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function getExchangeRate(from, to) {
  const response = await fetch(`${API_BASE}/exchange?from=${from}&to=${to}`)
  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function getIntelligenceReport(id) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/intelligence/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export default {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  getBreakEven,
  getExchangeRate,
  getIntelligenceReport,
}
