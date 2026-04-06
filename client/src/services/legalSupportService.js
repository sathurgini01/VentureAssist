const API_BASE = '/api/legal'
const TOOLKIT_BASE = '/api/legal'

const getToken = () => localStorage.getItem('auth_token')

const buildHeaders = (isJson = true) => {
  const headers = {}
  const token = getToken()
  if (isJson) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

const parseResponse = async (response) => {
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

export const getLegalProgress = async () => {
  const response = await fetch(`${API_BASE}/progress/me`, {
    headers: buildHeaders(false),
  })
  return parseResponse(response)
}

export const getLegalTasks = async (category = '', summary = false) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (summary) params.set('summary', 'true')

  const response = await fetch(`${API_BASE}/tasks${params.toString() ? `?${params}` : ''}`, {
    headers: buildHeaders(false),
  })
  return parseResponse(response)
}

export const getLegalTaskById = async (taskId) => {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    headers: buildHeaders(false),
  })
  return parseResponse(response)
}

export const getMyLegalSubmissions = async () => {
  const response = await fetch(`${API_BASE}/submissions/me`, {
    headers: buildHeaders(false),
  })
  return parseResponse(response)
}

export const getMySubmissionForTask = async (taskId) => {
  const response = await fetch(`${API_BASE}/tasks/${taskId}/submission/me`, {
    headers: buildHeaders(false),
  })
  return parseResponse(response)
}

export const submitLegalEvidence = async (taskId, payload) => {
  const response = await fetch(`${API_BASE}/tasks/${taskId}/submissions`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  })
  return parseResponse(response)
}

export const createLegalHelpRequest = async (payload) => {
  const response = await fetch(`${API_BASE}/help-requests`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  })
  return parseResponse(response)
}

export const getLegalToolkits = async () => {
  const response = await fetch(`${TOOLKIT_BASE}/toolkits`, {
    headers: buildHeaders(false),
  })
  return parseResponse(response)
}

export const askLegalCompliance = async (payload) => {
  const response = await fetch(`${API_BASE}/ai/compliance`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  })
  return parseResponse(response)
}
