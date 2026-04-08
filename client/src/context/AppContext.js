import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import {
  createCampaign as createCampaignApi,
  deleteCampaign as deleteCampaignApi,
  getCampaigns,
  updateCampaign as updateCampaignApi,
} from '../services/campaignService'
import {
  createTemplate as createTemplateApi,
  deleteTemplate as deleteTemplateApi,
  getTemplates,
  updateTemplate as updateTemplateApi,
} from '../services/templateService'
import {
  approveMentorApplication,
  createMentorRequest,
  getMentorApplications,
  getMentorRequests,
  getMentors,
  rejectMentorApplication,
  respondMentorRequest,
  submitMentorApplication as submitMentorApplicationApi,
} from '../services/mentorService'
import { getArticles } from '../services/articleService'

const AppContext = createContext(null)

const initialFilters = {
  status: 'all',
  category: 'all',
  role: 'all',
  expertise: 'all',
}

const initialNotifications = [
  { id: 'n1', message: 'Workspace scaffold is ready for API integration.', type: 'info' },
]

const initialUsers = [
  {
    id: 'u1',
    name: 'Ayesha Fernando',
    email: 'ayesha@ventureassist.app',
    role: 'Founder',
    status: 'Active',
    joined: '2026-01-12',
  },
  {
    id: 'u2',
    name: 'Nadia Perera',
    email: 'nadia@ventureassist.app',
    role: 'Mentor',
    status: 'Pending',
    joined: '2026-02-04',
  },
]

const initialMentorApplications = []

export function AppProvider({ children }) {
  const { user, setUser, token, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filters, setFilters] = useState(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')
  const [campaigns, setCampaigns] = useState([])
  const [templates, setTemplates] = useState([])
  const [mentors, setMentors] = useState([])
  const [articles, setArticles] = useState([])
  const [mentorRequests, setMentorRequests] = useState([])
  const [mentorApplications, setMentorApplications] = useState(initialMentorApplications)
  const [users, setUsers] = useState(initialUsers)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [userInfo, setUserInfo] = useState(user)

  const refreshTemplates = async () => {
    const data = await getTemplates()
    setTemplates(data)
    return data
  }

  const refreshCampaigns = async () => {
    const data = await getCampaigns()
    setCampaigns(data)
    return data
  }

  const refreshArticles = async () => {
    const articleData = await getArticles()
    setArticles(articleData)
    return articleData
  }

  const refreshMentors = async () => {
    const data = await getMentors(token, { expertiseArea: 'marketingDevelopment' })
    setMentors(data)
    return data
  }

  const refreshMentorRequests = async () => {
    const data = await getMentorRequests(token)
    setMentorRequests(data)

    if (user && user.role === 'user') {
      data
        .filter((item) => item.userId === user.id && item.status !== 'pending')
        .forEach((item) => {
          const key = `mentor_request_status_${item.id}`
          if (localStorage.getItem(key) !== item.status) {
            if (item.status === 'accepted') {
              addNotification(
                {
                  message: `${item.mentorName} approved your mentor session for ${item.topic}.`,
                  type: 'success',
                  category: 'mentor_session_approved',
                  details: {
                    dateTime: item.confirmedDateTime || '',
                    description: item.reply || '',
                    meetingUrl: item.medium || '',
                  },
                },
              )
            } else if (item.status === 'rejected') {
              addNotification(
                `${item.mentorName} rejected your mentor session for ${item.topic}.`,
                'info',
              )
            }
            localStorage.setItem(key, item.status)
          }
        })
    }

    return data
  }

  const refreshMentorApplications = async () => {
    const data = await getMentorApplications(token)
    setMentorApplications(data)

    if (user && user.role !== 'admin') {
      const myLatest = data.find((item) => item.userId === user.id)
      if (myLatest && myLatest.status !== 'pending') {
        const key = `mentor_application_status_${myLatest.id}`
        if (localStorage.getItem(key) !== myLatest.status) {
          const isApproved = myLatest.status === 'approved'
          addNotification(
            isApproved
              ? 'Your mentor request is approved. Please logout and login again as mentor.'
              : 'Your mentor request was not approved. Please improve your profile and re-apply.',
            isApproved ? 'success' : 'info',
          )
          localStorage.setItem(key, myLatest.status)
        }
      }
    }

    return data
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setCampaigns([])
      setTemplates([])
      setArticles([])
      return
    }

    Promise.all([
      refreshCampaigns(),
      refreshTemplates(),
      refreshMentors(),
      refreshArticles(),
      refreshMentorRequests(),
      refreshMentorApplications(),
    ]).then(([campaignData, templateData, mentorData, articleData, requestData]) => {
      setCampaigns(campaignData)
      setTemplates(templateData)
      setMentors(mentorData)
      setArticles(articleData)
      setMentorRequests(requestData)
    })
  }, [isAuthenticated, token])

  useEffect(() => {
    setUserInfo(user)
  }, [user])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, type }])
    return id
  }

  const clearToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const addNotification = (input, type = 'info') => {
    const isObjectPayload = typeof input === 'object' && input !== null
    const notification = {
      id: `n-${Date.now()}`,
      message: isObjectPayload ? input.message : input,
      type: isObjectPayload ? (input.type || 'info') : type,
      category: isObjectPayload ? (input.category || 'general') : 'general',
      details: isObjectPayload ? (input.details || null) : null,
    }
    setNotifications((current) => [notification, ...current])
    return notification
  }

  const dismissNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id))
  }

  const createCampaign = async (campaignInput) => {
    const created = await createCampaignApi(campaignInput, token)
    await refreshCampaigns()
    addNotification(`Campaign created: ${created.name}`)
    addToast('Campaign created successfully.', 'success')
    return created
  }

  const updateCampaign = async (id, updates) => {
    await updateCampaignApi(id, updates, token)
    await refreshCampaigns()
    addToast('Campaign updated.', 'success')
  }

  const deleteCampaign = async (id) => {
    await deleteCampaignApi(id, token)
    await refreshCampaigns()
    addToast('Campaign deleted.', 'info')
  }

  const applyTemplateToCampaign = (template) => {
    setSelectedTemplate(template)
    addNotification(`Template selected: ${template.name}`)
    addToast('Template applied to campaign draft.', 'success')
  }

  const createTemplate = async (templateInput) => {
    const created = await createTemplateApi(templateInput, token)
    await refreshTemplates()
    addToast('Template created successfully.', 'success')
    return created
  }

  const updateTemplate = async (templateId, templateInput) => {
    const updated = await updateTemplateApi(templateId, templateInput, token)
    await refreshTemplates()
    addToast('Template updated successfully.', 'success')
    return updated
  }

  const deleteTemplate = async (templateId) => {
    await deleteTemplateApi(templateId, token)
    await refreshTemplates()
    addToast('Template deleted successfully.', 'success')
  }

  const bookMentorSession = async (mentor, sessionInput) => {
    const {
      topic = 'General mentoring session',
      preferredDateTime = 'Next available slot',
      message = '',
    } = sessionInput

    const request = await createMentorRequest(
      {
        mentorId: mentor.id,
        topic,
        message: message || `Request sent to ${mentor.name} for ${topic}.`,
        preferredDateTime,
        domain: sessionInput?.domain || 'marketingDevelopment',
      },
      token,
    )

    await refreshMentorRequests()
    addNotification(`Request sent to ${mentor.name}. Booking is pending approval.`)
    addToast('Request sent. Booking is pending approval.', 'info')
    return request
  }

  const updateMentorRequest = async (id, payload) => {
    const nextPayload = typeof payload === 'string' ? { status: payload } : payload
    const updated = await respondMentorRequest(id, nextPayload, token)
    await refreshMentorRequests()

    if (updated.status === 'accepted') {
      addNotification(
        `${updated.mentorName} accepted your session request for ${updated.topic}.`,
        'success',
      )
      addToast('Mentor request accepted.', 'success')
      return updated
    }

    if (updated.status === 'rejected') {
      addNotification(
        `${updated.mentorName} declined your session request for ${updated.topic}.`,
        'info',
      )
      addToast('Mentor request declined.', 'info')
      return updated
    }

    addToast(`Request ${updated.status}.`, 'info')
    return updated
  }

  const submitMentorApplication = async (application) => {
    try {
      await submitMentorApplicationApi(application, token)
      await refreshMentorApplications()
      addNotification('Mentor application submitted.')
      addToast('Mentor application submitted.', 'success')
      return true
    } catch (error) {
      addToast(error?.message || 'Failed to submit mentor application.', 'warning')
      throw error
    }
  }

  const reviewMentorApplication = async (id, status, adminNote = '') => {
    if (String(status).toLowerCase() === 'approved') {
      await approveMentorApplication(id, adminNote, token)
    } else {
      await rejectMentorApplication(id, adminNote, token)
    }
    await refreshMentorApplications()
    await refreshMentors()
    addToast(`Application ${String(status).toLowerCase()}.`, 'success')
  }

  const updateArticleStatus = (id, status) => {
    setArticles((current) =>
      current.map((article) =>
        article.id === id ? { ...article, status } : article,
      ),
    )
    addToast(`Article ${status.toLowerCase()}.`, 'success')
  }

  const updateUserProfile = (updates) => {
    const nextUser = { ...(userInfo ?? {}), ...updates }
    setUserInfo(nextUser)
    setUser(nextUser)
    addToast('Profile updated.', 'success')
    addNotification('Your profile changes were saved.')
  }

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      toasts,
      addToast,
      clearToast,
      notifications,
      addNotification,
      dismissNotification,
      filters,
      setFilters,
      searchQuery,
      setSearchQuery,
      campaigns,
      templates,
      mentors,
      articles,
      mentorRequests,
      mentorApplications,
      users,
      userInfo,
      selectedTemplate,
      setSelectedTemplate,
      createCampaign,
      updateCampaign,
      deleteCampaign,
      refreshCampaigns,
      applyTemplateToCampaign,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      refreshTemplates,
      bookMentorSession,
      updateMentorRequest,
      submitMentorApplication,
      reviewMentorApplication,
      refreshMentorApplications,
      refreshMentorRequests,
      updateArticleStatus,
      refreshArticles,
      updateUserProfile,
      setUsers,
    }),
    [
      sidebarOpen,
      toasts,
      notifications,
      filters,
      searchQuery,
      campaigns,
      templates,
      mentors,
      articles,
      mentorRequests,
      mentorApplications,
      users,
      userInfo,
      selectedTemplate,
      token,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }

  return context
}
