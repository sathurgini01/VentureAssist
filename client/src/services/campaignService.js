const API_BASE = '/api/marketing/campaigns'

const getToken = () => sessionStorage.getItem('auth_token')

const parseError = async (response) => {
  try {
    const data = await response.json()
    return data?.message || 'Request failed'
  } catch {
    return 'Request failed'
  }
}

const normalizeCampaign = (item) => ({
  id: item?._id,
  name: item?.title ?? 'Untitled campaign',
  title: item?.title ?? 'Untitled campaign',
  status: item?.status ?? 'planned',
  progress: Number(item?.progress ?? 0),
  templateId: item?.templateId?._id ?? item?.templateId ?? null,
  template: item?.templateId ?? null,
  owner: item?.owner?.name ?? 'Current user',
  tasks: Array.isArray(item?.tasks) ? item.tasks : [],
  metricDefinitions: Array.isArray(item?.metricDefinitions) ? item.metricDefinitions : [],
  metricValues: Array.isArray(item?.metricValues) ? item.metricValues : [],
  metrics: item?.metrics ?? {},
  impressions: String(item?.metrics?.impressions ?? 0),
  clicks: String(item?.metrics?.clicks ?? 0),
  leads: String(item?.metrics?.leads ?? 0),
  sales: String(item?.metrics?.sales ?? 0),
  budgetSpentLKR: Number(item?.metrics?.budgetSpentLKR ?? 0),
  revenue: Number(item?.metrics?.revenue ?? 0),
  createdAt: item?.createdAt,
  updatedAt: item?.updatedAt,
})

export async function getCampaigns() {
  try {
    const token = getToken()
    if (!token) return []
    const response = await fetch(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return []
    const data = await response.json()
    return (data?.items ?? []).map(normalizeCampaign)
  } catch {
    return []
  }
}

export async function getCampaignById(campaignId, token = getToken()) {
  const response = await fetch(`${API_BASE}/${campaignId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(await parseError(response))
  }
  return normalizeCampaign(await response.json())
}

export async function createCampaign(campaignInput, token = getToken()) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(campaignInput),
  })
  if (!response.ok) {
    throw new Error(await parseError(response))
  }
  const data = await response.json()
  return normalizeCampaign(data.campaign)
}

export async function updateCampaign(campaignId, campaignInput, token = getToken()) {
  const response = await fetch(`${API_BASE}/${campaignId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(campaignInput),
  })
  if (!response.ok) {
    throw new Error(await parseError(response))
  }
  const data = await response.json()
  return normalizeCampaign(data.campaign)
}

export async function deleteCampaign(campaignId, token = getToken()) {
  const response = await fetch(`${API_BASE}/${campaignId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(await parseError(response))
  }
  return true
}

const campaignService = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
}

export default campaignService
