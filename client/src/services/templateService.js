import { apiBase } from '../config/api.js'
const API_BASE = apiBase('/api/marketing/templates')

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

const normalizeTemplate = (item) => ({
  id: item?._id,
  title: item?.title ?? 'Untitled template',
  name: item?.title ?? 'Untitled template',
  headline: item?.description ?? '',
  format: item?.stage ?? 'earlyStartup',
  description: item?.description ?? '',
  stage: item?.stage ?? 'earlyStartup',
  category: item?.category ?? 'General',
  tags: Array.isArray(item?.tags) ? item.tags : [],
  durationLabel: item?.durationLabel ?? '',
  objective: item?.objective ?? '',
  campaignOverview: item?.campaignOverview ?? '',
  targetAudience: item?.targetAudience ?? '',
  idealFor: Array.isArray(item?.idealFor) ? item.idealFor : [],
  estimatedBudgetLKR: Number(item?.estimatedBudgetLKR ?? 0),
  estimatedDurationDays: Number(item?.estimatedDurationDays ?? 0),
  budgetBreakdown: Array.isArray(item?.budgetBreakdown) ? item.budgetBreakdown : [],
  executionPlan: Array.isArray(item?.executionPlan) ? item.executionPlan : [],
  expectedResults: Array.isArray(item?.expectedResults) ? item.expectedResults : [],
  finalOutputItems: Array.isArray(item?.finalOutputItems) ? item.finalOutputItems : [],
  steps: Array.isArray(item?.steps) ? item.steps : [],
  metricDefinitions: Array.isArray(item?.metricDefinitions) ? item.metricDefinitions : [],
  createdBy: item?.createdBy,
})

export async function getTemplates() {
  try {
    const token = getToken()
    if (!token) return []

    const response = await fetch(`${API_BASE}?page=1&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) return []
    const data = await response.json()
    const items = Array.isArray(data?.items) ? data.items : []
    return items.map(normalizeTemplate)
  } catch {
    return []
  }
}

export async function getTemplateById(templateId) {
  const token = getToken()
  const response = await fetch(`${API_BASE}/${templateId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return normalizeTemplate(await response.json())
}

export async function createTemplate(templateInput, token = getToken()) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(templateInput),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  return normalizeTemplate(data.template)
}

export async function updateTemplate(templateId, templateInput, token = getToken()) {
  const response = await fetch(`${API_BASE}/${templateId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(templateInput),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  return normalizeTemplate(data.template)
}

export async function deleteTemplate(templateId, token = getToken()) {
  const response = await fetch(`${API_BASE}/${templateId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return true
}

const templateService = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
}

export default templateService
