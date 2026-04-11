const API_BASE = '/api/finance/expenses'

const parseError = async (response) => {
  try {
    const data = await response.json()
    return data?.message || 'Request failed'
  } catch {
    return 'Request failed'
  }
}

export async function getExpenses(profileId) {
  const response = await fetch(`${API_BASE}/${profileId}`)
  if (!response.ok) return []
  return await response.json()
}

export async function addExpense(data) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function updateExpense(id, data) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(await parseError(response))
  return await response.json()
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error(await parseError(response))
  return true
}

export default {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
}
