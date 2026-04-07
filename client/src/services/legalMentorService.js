const API = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")

const getToken = () => localStorage.getItem('auth_token') || localStorage.getItem('token') || ''

const getHeaders = (isJson = false) => {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (isJson) headers['Content-Type'] = 'application/json'
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

export const getMentorReviews = async () => {
  const res = await fetch(`${API}/api/legal/mentor/reviews`, {
    headers: getHeaders(),
  });
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.submissions || []
};

export const getMentorHelpRequests = async () => {
  const res = await fetch(`${API}/api/legal/mentor/help-requests`, {
    headers: getHeaders(),
  });
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.requests || []
};

export const updateSubmission = async (id, data) => {
  const res = await fetch(`${API}/api/legal/mentor/submissions/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return parseResponse(res)
};