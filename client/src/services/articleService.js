import { apiBase } from '../config/api.js'
const API_BASE = apiBase('/api/marketing/articles')

const parseErrorMessage = async (response) => {
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

const toStatus = (stage) => {
  if (stage === 'earlyStartup') return 'Draft'
  if (stage === 'growing') return 'Published'
  if (stage === 'established') return 'Published'
  return 'Draft'
}

const formatDate = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const estimateReadTime = (content = '') => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

const normalizeArticle = (article) => {
  const content = article?.content ?? ''
  return {
    id: article?._id,
    title: article?.title ?? 'Untitled',
    excerpt: content.slice(0, 140) + (content.length > 140 ? '...' : ''),
    author: article?.createdBy?.name ?? 'Venture Assist Team',
    date: formatDate(article?.createdAt),
    readTime: estimateReadTime(content),
    category: article?.category ?? 'General',
    status: toStatus(article?.stage),
    views: '0',
    content,
    thumbnail: article?.category ?? 'Article',
    createdAt: article?.createdAt,
  }
}

export async function getArticles() {
  try {
    const response = await fetch(`${API_BASE}?page=1&limit=50`)
    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const items = Array.isArray(data?.items) ? data.items : []
    return items.map(normalizeArticle)
  } catch {
    return []
  }
}

export async function getArticleById(articleId) {
  try {
    const response = await fetch(`${API_BASE}/${articleId}`)
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return normalizeArticle(data)
  } catch {
    return null
  }
}

export async function createArticle(articleInput, token) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleInput),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = await response.json()
  return normalizeArticle(data.article)
}

export async function updateArticle(articleId, articleInput, token) {
  const response = await fetch(`${API_BASE}/${articleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleInput),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = await response.json()
  return normalizeArticle(data.article)
}

export async function deleteArticle(articleId, token) {
  const response = await fetch(`${API_BASE}/${articleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return true
}

const articleService = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
}

export default articleService
