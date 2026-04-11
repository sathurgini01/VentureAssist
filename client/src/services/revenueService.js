const API_BASE = '/api/finance/revenue'

const getToken = () => sessionStorage.getItem('auth_token')

const parseError = async (response) => {
  try {
    const data = await response.json()
    return data?.message || 'Request failed'
  } catch {
    return 'Request failed'
  }
}

export async function getRevenue(profileId) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${profileId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!response.ok) return []
  return await response.json()
}

export async function addRevenue(data) {
  const token = getToken()
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function updateRevenue(id, data) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function deleteRevenue(id) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!response.ok) throw new Error(await parseError(response))
  return true
}

export default {
  getRevenue,
  addRevenue,
  updateRevenue,
  deleteRevenue,
}
