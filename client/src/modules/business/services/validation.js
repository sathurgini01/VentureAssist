export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,15}$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim())
}

export function isValidPhoneNumber(value) {
  return PHONE_PATTERN.test(String(value || '').trim())
}

export function isFutureDateTime(value) {
  if (!value) {
    return false
  }

  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) && timestamp > Date.now()
}
