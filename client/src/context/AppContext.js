import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { getCampaigns } from '../services/campaignService'
import { getTemplates } from '../services/templateService'
import { getMentors, getMentorRequests } from '../services/mentorService'
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

const initialMentorApplications = [
  {
    id: 'a1',
    name: 'Nadia Perera',
    expertise: 'Fundraising',
    experience: '8 years',
    appliedDate: '2026-03-14',
    status: 'Reviewing',
  },
  {
    id: 'a2',
    name: 'Liam Santos',
    expertise: 'Growth',
    experience: '6 years',
    appliedDate: '2026-03-18',
    status: 'Pending',
  },
]

export function AppProvider({ children }) {
  const { user, setUser } = useAuth()
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

  useEffect(() => {
    Promise.all([
      getCampaigns(),
      getTemplates(),
      getMentors(),
      getArticles(),
      getMentorRequests(),
    ]).then(([campaignData, templateData, mentorData, articleData, requestData]) => {
      setCampaigns(campaignData)
      setTemplates(templateData)
      setMentors(mentorData)
      setArticles(articleData)
      setMentorRequests(requestData)
    })
  }, [])

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

  const addNotification = (message, type = 'info') => {
    const notification = { id: `n-${Date.now()}`, message, type }
    setNotifications((current) => [notification, ...current])
    return notification
  }

  const dismissNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id))
  }

  const createCampaign = (campaignInput) => {
    const newCampaign = {
      id: `cmp-${Date.now()}`,
      name: campaignInput.campaignName,
      title: campaignInput.campaignName,
      status: 'draft',
      platform: campaignInput.platform,
      impressions: '0',
      owner: userInfo?.name ?? 'Venture Assist User',
      description: campaignInput.description,
      audience: campaignInput.interests?.join(', ') || 'General',
      budget: campaignInput.budget,
      cta: campaignInput.cta,
      startDate: campaignInput.startDate,
      endDate: campaignInput.endDate,
    }

    setCampaigns((current) => [newCampaign, ...current])
    addNotification(`Campaign created: ${newCampaign.name}`)
    addToast('Campaign created successfully.', 'success')
    return newCampaign
  }

  const updateCampaign = (id, updates) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updates } : campaign,
      ),
    )
    addToast('Campaign updated.', 'success')
  }

  const deleteCampaign = (id) => {
    setCampaigns((current) => current.filter((campaign) => campaign.id !== id))
    addToast('Campaign deleted.', 'info')
  }

  const applyTemplateToCampaign = (template) => {
    setSelectedTemplate(template)
    addNotification(`Template selected: ${template.name}`)
    addToast('Template applied to campaign draft.', 'success')
  }

  const bookMentorSession = (mentor, sessionInput) => {
    const {
      topic = 'General mentoring session',
      preferredDateTime = 'Next available slot',
      message = '',
    } = sessionInput

    const request = {
      id: `req-${Date.now()}`,
      userId: userInfo?.id ?? 'guest-user',
      userName: userInfo?.name ?? 'Founder',
      userEmail: userInfo?.email ?? 'user@ventureassist.app',
      mentorId: mentor.id,
      topic,
      preferredTime: preferredDateTime,
      message: message || `Request sent to ${mentor.name} for ${topic}.`,
      status: 'pending',
      mentor: mentor.name,
      mentorName: mentor.name,
      confirmedDateTime: '',
      medium: '',
    }

    setMentorRequests((current) => [request, ...current])
    addNotification(`Request sent to ${mentor.name}. Booking is pending approval.`)
    addToast('Request sent. Booking is pending approval.', 'info')
    return request
  }

  const updateMentorRequest = (id, status) => {
    let updatedRequest = null

    setMentorRequests((current) =>
      current.map((request) => {
        if (request.id !== id) {
          return request
        }

        updatedRequest = {
          ...request,
          status,
          confirmedDateTime:
            status === 'accepted' ? request.preferredTime : request.confirmedDateTime,
          medium: status === 'accepted' ? 'Zoom' : '',
        }

        return updatedRequest
      }),
    )

    if (!updatedRequest) {
      return
    }

    if (status === 'accepted') {
      addNotification(
        `${updatedRequest.mentorName} accepted your session request for ${updatedRequest.topic}.`,
        'success',
      )
      addToast('Mentor request accepted.', 'success')
      return
    }

    if (status === 'declined') {
      addNotification(
        `${updatedRequest.mentorName} declined your session request for ${updatedRequest.topic}.`,
        'info',
      )
      addToast('Mentor request declined.', 'info')
      return
    }

    addToast(`Request ${status}.`, 'info')
  }

  const submitMentorApplication = (application) => {
    const newApplication = {
      id: `app-${Date.now()}`,
      name: userInfo?.name ?? 'New Mentor',
      expertise: application.expertise.join(', '),
      experience: application.background,
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    }

    setMentorApplications((current) => [newApplication, ...current])
    addNotification('Mentor application submitted.')
    addToast('Mentor application submitted.', 'success')
  }

  const reviewMentorApplication = (id, status) => {
    setMentorApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    )
    addToast(`Application ${status.toLowerCase()}.`, 'success')
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
      applyTemplateToCampaign,
      bookMentorSession,
      updateMentorRequest,
      submitMentorApplication,
      reviewMentorApplication,
      updateArticleStatus,
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
