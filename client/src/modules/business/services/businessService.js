import axios from 'axios'
import { apiBase } from '../../../config/api.js'

export const BUSINESS_DRAFT_STORAGE_KEY = 'venture-assist-business-draft'

export const EMPTY_IDEA_FORM = {
  title: '',
  summary: '',
  problem: '',
  solution: '',
  targetCustomer: '',
  location: '',
  uniqueness: '',
  resources: '',
  challenges: '',
  opportunities: '',
  revenueModel: '',
  nextMonthGoal: '',
}

const ideaFields = Object.keys(EMPTY_IDEA_FORM)

const businessClient = axios.create({
  baseURL: apiBase('/api/business'),
})

function extractMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}

function createBusinessError(error, fallback) {
  const businessError = new Error(extractMessage(error, fallback))
  businessError.status = error?.response?.status ?? 500
  businessError.original = error
  return businessError
}

async function request(config, fallbackMessage) {
  try {
    const response = await businessClient(config)
    return response.data
  } catch (error) {
    throw createBusinessError(error, fallbackMessage)
  }
}

export function getStoredBusinessDraft() {
  const rawDraft = window.localStorage.getItem(BUSINESS_DRAFT_STORAGE_KEY)

  if (!rawDraft) {
    return null
  }

  try {
    return { ...EMPTY_IDEA_FORM, ...JSON.parse(rawDraft) }
  } catch {
    window.localStorage.removeItem(BUSINESS_DRAFT_STORAGE_KEY)
    return null
  }
}

export function saveBusinessDraft(values) {
  window.localStorage.setItem(BUSINESS_DRAFT_STORAGE_KEY, JSON.stringify(values))
}

export function clearBusinessDraft() {
  window.localStorage.removeItem(BUSINESS_DRAFT_STORAGE_KEY)
}

export function validateIdeaValues(values, { isDraft = false } = {}) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'A clear idea title is required.'
  }

  if (!isDraft && !values.summary.trim()) {
    errors.summary = 'Add a short summary so the idea is easy to review.'
  }

  if (!values.problem.trim()) {
    errors.problem = 'Describe the customer problem you want to solve.'
  }

  if (!isDraft && !values.solution.trim()) {
    errors.solution = 'Explain how your solution addresses the problem.'
  }

  if (!isDraft && !values.targetCustomer.trim()) {
    errors.targetCustomer = 'Identify the main customer segment.'
  }

  return errors
}

export function getIdeaCompletion(idea) {
  const filledFields = ideaFields.filter((field) => {
    const value = idea?.[field]
    return typeof value === 'string' ? Boolean(value.trim()) : Boolean(value)
  })
  return Math.round((filledFields.length / ideaFields.length) * 100)
}

export function getIdeaStage(idea) {
  const completion = getIdeaCompletion(idea)

  if (completion < 35) {
    return 'Draft'
  }

  if (completion < 70) {
    return 'Refining'
  }

  return 'Ready to validate'
}

export function normalizeSwot(swot) {
  if (!swot) {
    return null
  }

  return {
    strengths: swot.strengths ?? [],
    weaknesses: swot.weaknesses ?? [],
    opportunities: swot.opportunities ?? [],
    threats: swot.threats ?? [],
    generatedBy: swot.generatedBy ?? 'ai',
    updatedAt: swot.updatedAt,
  }
}

export function decorateIdea(idea, swot = null) {
  const completion = getIdeaCompletion(idea)
  const stage = getIdeaStage(idea)

  return {
    ...idea,
    progress: completion,
    stage,
    swotStatus: swot ? 'Generated' : 'Pending',
    swot,
    shortSummary: idea.summary || idea.problem || 'No summary added yet.',
  }
}

export async function getBusinessHome() {
  return request({ method: 'get', url: '/home' }, 'Unable to load the business dashboard.')
}

export async function getIdeas() {
  return request({ method: 'get', url: '/ideas' }, 'Unable to load ideas right now.')
}

export async function getIdeasWithInsights() {
  const ideas = await getIdeas()
  const swots = await Promise.all(ideas.map((idea) => getIdeaSwot(idea._id).catch(() => null)))

  return ideas.map((idea, index) => decorateIdea(idea, swots[index]))
}

export async function createIdea(payload) {
  return request({ method: 'post', url: '/ideas', data: payload }, 'Unable to submit the idea.')
}

export async function updateIdea(id, payload) {
  return request(
    { method: 'put', url: `/ideas/${id}`, data: payload },
    'Unable to update the idea.',
  )
}

export async function deleteIdea(id) {
  return request({ method: 'delete', url: `/ideas/${id}` }, 'Unable to delete the idea.')
}

export async function getIdeaById(id) {
  return request({ method: 'get', url: `/ideas/${id}` }, 'Unable to load the idea details.')
}

export async function getIdeaSwot(id) {
  const swot = await request(
    { method: 'get', url: `/ideas/${id}/swot` },
    'Unable to load the SWOT analysis.',
  )

  return normalizeSwot(swot)
}

export async function generateIdeaSwot(id) {
  const swot = await request(
    { method: 'post', url: `/ideas/${id}/swot/generate` },
    'Unable to generate the SWOT analysis.',
  )

  return normalizeSwot(swot)
}

export async function getToolkits() {
  return request({ method: 'get', url: '/toolkits' }, 'Unable to load toolkits right now.')
}

export async function createToolkit(payload) {
  return request({ method: 'post', url: '/toolkits', data: payload }, 'Unable to create the toolkit.')
}

export async function updateToolkit(toolkitId, payload) {
  return request(
    { method: 'put', url: `/toolkits/${toolkitId}`, data: payload },
    'Unable to update the toolkit.',
  )
}

export async function deleteToolkit(toolkitId) {
  return request({ method: 'delete', url: `/toolkits/${toolkitId}` }, 'Unable to delete the toolkit.')
}

export async function getToolkitById(toolkitId) {
  return request(
    { method: 'get', url: `/toolkits/${toolkitId}` },
    'Unable to load the toolkit details.',
  )
}

export async function getMentors() {
  return request({ method: 'get', url: '/mentors' }, 'Unable to load mentors right now.')
}

export async function getMentorById(mentorId) {
  return request(
    { method: 'get', url: `/mentors/${mentorId}` },
    'Unable to load the mentor details.',
  )
}

export async function createMentor(payload) {
  return request({ method: 'post', url: '/mentors', data: payload }, 'Unable to create the mentor.')
}

export async function updateMentor(mentorId, payload) {
  return request(
    { method: 'put', url: `/mentors/${mentorId}`, data: payload },
    'Unable to update the mentor.',
  )
}

export async function deleteMentor(mentorId) {
  return request({ method: 'delete', url: `/mentors/${mentorId}` }, 'Unable to delete the mentor.')
}

export async function createMentorRequest(payload) {
  return request(
    { method: 'post', url: '/mentor-requests', data: payload },
    'Unable to send the mentor request.',
  )
}

export async function getMentorRequests(params = {}) {
  return request(
    { method: 'get', url: '/mentor-requests', params },
    'Unable to load mentor requests.',
  )
}

export async function updateMentorRequestStatus(id, payload) {
  return request(
    { method: 'put', url: `/mentor-requests/${id}`, data: payload },
    'Unable to update the mentor request.',
  )
}

export async function deleteMentorRequest(id) {
  return request(
    { method: 'delete', url: `/mentor-requests/${id}` },
    'Unable to delete the mentor request.',
  )
}

export async function initIdeaTracker(ideaId) {
  return request(
    { method: 'post', url: `/trackers/init/${ideaId}` },
    'Unable to create the tracker for this idea.',
  )
}

export async function getIdeaTracker(ideaId) {
  try {
    return await request(
      { method: 'get', url: `/tracker/${ideaId}` },
      'Unable to load the tracker.',
    )
  } catch (error) {
    if (error.status === 404) {
      await initIdeaTracker(ideaId)
    } else if (error.status && error.status !== 400) {
      throw error
    }
  }

  try {
    return await request(
      { method: 'get', url: '/trackers', params: { ideaId } },
      'Unable to load the tracker.',
    )
  } catch (fallbackError) {
    if (fallbackError.status === 404) {
      await initIdeaTracker(ideaId)
      return request(
        { method: 'get', url: '/trackers', params: { ideaId } },
        'Unable to load the tracker.',
      )
    }

    throw fallbackError
  }
}

export async function updateTrackerItem(trackerId, itemId, payload) {
  return request(
    { method: 'put', url: `/trackers/${trackerId}/items/${itemId}`, data: payload },
    'Unable to update the tracker item.',
  )
}
