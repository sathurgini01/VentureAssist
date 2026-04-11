const getToken = () => sessionStorage.getItem('auth_token') || sessionStorage.getItem('token') || ''

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
  const res = await fetch(`/api/legal/mentor/reviews`, {
    headers: getHeaders(),
  });
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.submissions || []
};

export const getMentorHelpRequests = async () => {
  const res = await fetch(`/api/legal/mentor/help-requests`, {
    headers: getHeaders(),
  });
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.requests || []
};

export const updateSubmission = async (id, data) => {
  const res = await fetch(`/api/legal/mentor/submissions/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return parseResponse(res)
};

export const getMentorSubmissionsForUser = async (userId) => {
  const res = await fetch(`/api/legal/mentor/submissions/user/${userId}`, {
    headers: getHeaders(),
  });
  return parseResponse(res)
};

export const getMentorSubmissionHistory = async () => {
  const res = await fetch(`/api/legal/mentor/submissions/history`, {
    headers: getHeaders(),
  });
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.submissions || []
};

export const replyToHelpRequest = async (id, data) => {
  const res = await fetch(`/api/legal/mentor/help-requests/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return parseResponse(res)
};