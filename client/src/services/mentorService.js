const API_MENTORS = '/api/marketing/mentors'
const API_MENTOR_REQUESTS = '/api/marketing/mentor-requests'
const API_MENTOR_APPLICATIONS = '/api/marketing/mentor-applications'

const getToken = () => localStorage.getItem('auth_token')

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

const normalizeMentor = (item) => {
  const name = item?.name || 'Mentor'
  return {
    id: item?._id,
    photo: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    name,
    title: 'Startup Mentor',
    rating: '4.8',
    reviews: 0,
    expertise: ['Business Idea', 'Marketing & Development', 'Law'],
    availability: 'Available by request',
    rate: 'Negotiable',
    priceBand: '80',
  }
}

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '')

const normalizeMentorRequest = (item) => ({
  id: item?._id,
  userId: item?.userId?._id ?? item?.userId,
  userName: item?.userId?.name ?? 'User',
  userEmail: item?.userId?.email ?? '',
  mentorId: item?.mentorId?._id ?? item?.mentorId,
  mentorName: item?.mentorId?.name ?? 'Mentor',
  topic: item?.topic ?? '',
  domain: item?.domain ?? 'marketingDevelopment',
  preferredTime: formatDate(item?.preferredDateTime),
  message: item?.message ?? '',
  status: item?.status ?? 'pending',
  reply: item?.reply ?? '',
  confirmedDateTime: formatDate(item?.scheduledDateTime),
  medium: item?.meetingUrl ?? '',
})

const normalizeMentorApplication = (item) => ({
  id: item?._id,
  userId: item?.userId?._id ?? item?.userId,
  name: item?.userId?.name ?? 'Applicant',
  email: item?.userId?.email ?? '',
  expertise: Array.isArray(item?.expertiseAreas) ? item.expertiseAreas.join(', ') : '',
  experience: item?.yearsExperience ? `${item.yearsExperience} years` : 'N/A',
  qualification: item?.qualification ?? '',
  bio: item?.bio ?? '',
  appliedDate: item?.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : 'N/A',
  status: item?.status ?? 'pending',
  adminNote: item?.adminNote ?? '',
})

export async function getMentors(token = getToken()) {
  try {
    const response = await fetch(API_MENTORS, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return []
    const data = await response.json()
    return (data?.mentors ?? []).map(normalizeMentor)
  } catch {
    return []
  }
}

export async function getMentorRequests(token = getToken()) {
  try {
    const response = await fetch(API_MENTOR_REQUESTS, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return []
    const data = await response.json()
    return (data?.requests ?? []).map(normalizeMentorRequest)
  } catch {
    return []
  }
}

export async function createMentorRequest(input, token = getToken()) {
  const response = await fetch(API_MENTOR_REQUESTS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) throw new Error(await parseError(response))
  const data = await response.json()
  return normalizeMentorRequest(data.request)
}

export async function respondMentorRequest(requestId, input, token = getToken()) {
  const response = await fetch(`${API_MENTOR_REQUESTS}/${requestId}/respond`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) throw new Error(await parseError(response))
  const data = await response.json()
  return normalizeMentorRequest(data.request)
}

export async function submitMentorApplication(input, token = getToken()) {
  const response = await fetch(API_MENTOR_APPLICATIONS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error(await parseError(response))
  const data = await response.json()
  return normalizeMentorApplication(data.application)
}

export async function getMentorApplications(token = getToken()) {
  const response = await fetch(API_MENTOR_APPLICATIONS, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(await parseError(response))
  const data = await response.json()
  return (data?.applications ?? []).map(normalizeMentorApplication)
}

export async function approveMentorApplication(applicationId, adminNote = '', token = getToken()) {
  const response = await fetch(`${API_MENTOR_APPLICATIONS}/${applicationId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ adminNote }),
  })
  if (!response.ok) throw new Error(await parseError(response))
  return true
}

export async function rejectMentorApplication(applicationId, adminNote = '', token = getToken()) {
  const response = await fetch(`${API_MENTOR_APPLICATIONS}/${applicationId}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ adminNote }),
  })
  if (!response.ok) throw new Error(await parseError(response))
  return true
}

const mentorService = {
  getMentors,
  getMentorRequests,
  createMentorRequest,
  respondMentorRequest,
  submitMentorApplication,
  getMentorApplications,
  approveMentorApplication,
  rejectMentorApplication,
}

export default mentorService
