export const legalUserLinks = [
  { to: '/toolkits/legal', label: 'Legal Home' },
  { to: '/toolkits/legal/dashboard', label: 'Task Dashboard' },
  { to: '/toolkits/legal/progress', label: 'Progress' },
  { to: '/toolkits/legal/ai', label: 'AI Assistant' },
]

export const defaultLegalCategories = [
  'Registration & Structure',
  'Licensing & Permits',
  'Tax & Compliance',
  'Contracts & Agreements',
  'Policies & Legal Protection',
]

const legalCategoryMap = {
  Registration: 'Registration & Structure',
  Licenses: 'Licensing & Permits',
  Contracts: 'Contracts & Agreements',
  Policies: 'Policies & Legal Protection',
}

export const normalizeLegalCategory = (value) => {
  if (!value || typeof value !== 'string') return value
  const trimmed = value.trim()
  return legalCategoryMap[trimmed] || trimmed
}

export const getLegalCategories = () => {
  return [...defaultLegalCategories]
}

export const statusMeta = {
  PENDING: { label: 'Pending', tone: 'neutral' },
  UNDER_REVIEW: { label: 'Under Review', tone: 'review' },
  APPROVED: { label: 'Approved', tone: 'success' },
  CHANGES_REQUESTED: { label: 'Changes Requested', tone: 'warning' },
}

export const getStatusMeta = (status) => statusMeta[status] || statusMeta.PENDING

export const formatDate = (value) => {
  if (!value) return 'Not available'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}
