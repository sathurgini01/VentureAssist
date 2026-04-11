const API_BASE = '/api/finance/revenue'

const parseError = async (response) => {
  try {
    const data = await response.json()
    return data?.message || 'Request failed'
  } catch {
    return 'Request failed'
  }
}

export async function getRevenue(profileId) {
  const response = await fetch(`${API_BASE}/${profileId}`)
  if (!response.ok) return []
  return await response.json()
}

export async function addRevenue(data) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function updateRevenue(id, data) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function deleteRevenue(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
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
