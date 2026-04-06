export const legalUserLinks = [
  { to: '/dashboard', label: 'Marketing Dashboard' },
  { to: '/toolkits/legal', label: 'Legal Home' },
  { to: '/toolkits/legal/dashboard', label: 'Task Dashboard' },
  { to: '/toolkits/legal/progress', label: 'Progress' },
  { to: '/toolkits/legal/ai', label: 'AI Assistant' },
]

export const legalCategories = [
  'Registration',
  'Licenses',
  'Tax & Compliance',
  'Contracts',
  'Policies',
]

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
