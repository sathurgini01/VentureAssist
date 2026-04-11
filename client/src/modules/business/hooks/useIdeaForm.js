import { useCallback, useState } from 'react'
import { EMPTY_IDEA_FORM, validateIdeaValues } from '../services/businessService'

export function useIdeaForm(initialValues = EMPTY_IDEA_FORM) {
  const [values, setValues] = useState({ ...EMPTY_IDEA_FORM, ...initialValues })
  const [errors, setErrors] = useState({})

  const updateField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }, [errors])

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    updateField(name, value)
  }, [updateField])

  const replaceValues = useCallback((nextValues) => {
    setValues({ ...EMPTY_IDEA_FORM, ...nextValues })
    setErrors({})
  }, [])

  const validate = useCallback((options) => {
    const nextErrors = validateIdeaValues(values, options)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [values])

  return {
    values,
    errors,
    setErrors,
    updateField,
    handleChange,
    replaceValues,
    validate,
  }
}
