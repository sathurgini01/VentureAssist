import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Toast from './components/Toast'
import './index.css'
import './styles/globals.css'
import './styles/Buttons.css'
import './styles/Cards.css'
import './styles/Forms.css'
import './styles/Tables.css'
import './styles/Modals.css'
import './styles/MarketingDashboard.css'
import ArticlesManage from './pages/Admin/MarketingAdminArticlesManagePage'
import MentorApplications from './pages/Admin/MarketingAdminMentorApplicationsPage'
import Settings from './pages/Admin/MarketingAdminSettingsPage'
import UserManagement from './pages/Admin/MarketingAdminUserManagementPage'
import Analytics from './pages/Dashboard/MarketingAnalyticsPage'
import Articles from './pages/Dashboard/MarketingArticlesPage'
import BecomeMentor from './pages/Dashboard/MarketingBecomeMentorPage'
import ArticleDetail from './pages/Dashboard/MarketingArticleDetailPage'
import CampaignOverview from './pages/Dashboard/MarketingCampaignOverviewPage'
import CampaignDetails from './pages/Dashboard/MarketingCampaignDetailsPage'
import Campaigns from './pages/Dashboard/MarketingCampaignsPage'
import CreateCampaign from './pages/Dashboard/MarketingCreateCampaignPage'
import MentorRequests from './pages/Dashboard/MarketingMentorRequestsPage'
import Mentors from './pages/Dashboard/MarketingMentorsPage'
import Templates from './pages/Dashboard/MarketingTemplatesPage'
import UserDashboard from './pages/Dashboard/MarketingUserDashboardPage'
import About from './pages/About'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'

function AppShell() {
  const { toasts } = useAppContext()
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/landing"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/campaigns"
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/campaigns/new"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/campaigns/:campaignId"
            element={
              <ProtectedRoute>
                <CampaignDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/campaigns/:campaignId/edit"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/mentors"
            element={
              <ProtectedRoute>
                <Mentors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/become-mentor"
            element={
              <ProtectedRoute>
                <BecomeMentor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/mentor-requests"
            element={
              <ProtectedRoute allowedRoles={['mentor', 'admin']}>
                <MentorRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/articles/:id"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/campaign-overview"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CampaignOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mentor-applications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MentorApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ArticlesManage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        <div className="toast-stack">
          {toasts.map((toast) => (
            <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} />
          ))}
        </div>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  )
}

export default App

