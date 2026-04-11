import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionButton, ActionLink, BusinessPageHeader, SectionCard } from '../components/BusinessComponents'
import { useIdeaForm } from '../hooks/useIdeaForm'
import {
  clearBusinessDraft,
  createIdea,
  EMPTY_IDEA_FORM,
  getIdeaById,
  getStoredBusinessDraft,
  saveBusinessDraft,
  updateIdea,
} from '../services/businessService'

const formFields = [
  ['title', 'Idea title', 'text', 'Give the concept a clear name'],
  ['summary', 'Summary', 'textarea', 'Summarize the concept in 2-3 sentences'],
  ['problem', 'Problem', 'textarea', 'What customer pain point are you solving?'],
  ['solution', 'Solution', 'textarea', 'Describe your proposed approach'],
  ['targetCustomer', 'Target customer', 'textarea', 'Who is this for?'],
  ['location', 'Location', 'text', 'Primary market or location'],
  ['uniqueness', 'Uniqueness', 'textarea', 'Why is this idea different?'],
  ['resources', 'Resources', 'textarea', 'List people, assets, or tools you need'],
  ['challenges', 'Challenges', 'textarea', 'What could slow you down?'],
  ['opportunities', 'Opportunities', 'textarea', 'What growth openings do you see?'],
  ['revenueModel', 'Revenue model', 'textarea', 'How could this make money?'],
  ['nextMonthGoal', 'Next month goal', 'textarea', 'What should happen in the next 30 days?'],
]

function BusinessIdeaFormPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [searchParams] = useSearchParams()
  const editingId = searchParams.get('edit')
  const { values, errors, handleChange, replaceValues, validate } = useIdeaForm(EMPTY_IDEA_FORM)
  const [loading, setLoading] = useState(Boolean(editingId))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadExistingIdea() {
      if (!editingId) {
        const storedDraft = getStoredBusinessDraft()
        if (storedDraft) {
          replaceValues(storedDraft)
        }
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const idea = await getIdeaById(editingId)

        if (isMounted) {
          replaceValues(idea)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadExistingIdea()

    return () => {
      isMounted = false
    }
  }, [editingId, replaceValues])

  function handleSaveDraft() {
    saveBusinessDraft(values)
    addToast('Draft saved locally. You can come back and finish it anytime.', 'success')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      addToast('Please fix the highlighted fields before submitting.', 'error')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const savedIdea = editingId ? await updateIdea(editingId, values) : await createIdea(values)

      clearBusinessDraft()
      addToast(editingId ? 'Idea updated successfully.' : 'Idea submitted successfully.', 'success')
      navigate(`/business/ideas/${savedIdea._id}`)
    } catch (submitError) {
      setError(submitError.message)
      addToast(submitError.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Preparing idea form"
        description="Loading your latest idea details and draft content."
      />
    )
  }

  if (error && editingId) {
    return (
      <ErrorState
        title="Unable to open this idea"
        message={error}
        actionLabel="Back to ideas"
        onAction={() => navigate('/business/ideas')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow={editingId ? 'Update idea' : 'Submit idea'}
        title={editingId ? 'Refine your business idea' : 'Capture your business idea clearly'}
        description="Use this workspace to make the idea concrete enough for SWOT generation, mentor feedback, and a clear next-step tracker."
        variant="ideas"
        actions={
          <>
            <ActionLink to="/business/ideas" variant="bannerSecondary">
              View ideas
            </ActionLink>
            <ActionLink to="/business" variant="banner">
              Back to dashboard
            </ActionLink>
          </>
        }
      />

      <SectionCard
        title="Idea brief"
        subtitle="Fields marked by validation are required for a full submission. Drafts stay in local storage until you submit."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            {formFields.map(([name, label, fieldType, placeholder]) => (
              <label key={name} className={fieldType === 'textarea' ? 'md:col-span-2' : ''}>
                <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
                {fieldType === 'textarea' ? (
                  <textarea
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    rows={4}
                    placeholder={placeholder}
                    className="min-h-[128px] w-full rounded-[22px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full rounded-[22px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                )}
                {errors[name] ? (
                  <span className="mt-2 block text-sm text-rose-700">{errors[name]}</span>
                ) : null}
              </label>
            ))}
          </div>

          {error && !editingId ? (
            <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <ActionButton type="button" onClick={handleSaveDraft} variant="secondary">
              Save Draft
            </ActionButton>
            <ActionButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : editingId ? 'Update Idea' : 'Submit'}
            </ActionButton>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}

export default BusinessIdeaFormPage
