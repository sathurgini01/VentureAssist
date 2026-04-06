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
import './styles/LegalToolkit.css'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import AdminMarketingDevelopmentArticlesPage from './pages/Admin/AdminMarketingDevelopmentArticlesPage'
import AdminMarketingDevelopmentTemplatesPage from './pages/Admin/AdminMarketingDevelopmentTemplatesPage'
import AdminMentorApprovalPage from './pages/Admin/AdminMentorApprovalPage'
import Analytics from './pages/Dashboard/MarketingAnalyticsPage'
import Articles from './pages/Dashboard/MarketingArticlesPage'
import BecomeMentor from './pages/Dashboard/MarketingBecomeMentorPage'
import ArticleDetail from './pages/Dashboard/MarketingArticleDetailPage'
import CampaignDetails from './pages/Dashboard/MarketingCampaignDetailsPage'
import Campaigns from './pages/Dashboard/MarketingCampaignsPage'
import CreateCampaign from './pages/Dashboard/MarketingCreateCampaignPage'
import Mentors from './pages/Dashboard/MarketingMentorsPage'
import MentorHub from './pages/Dashboard/MarketingMentorHubPage'
import Templates from './pages/Dashboard/MarketingTemplatesPage'
import UserDashboard from './pages/Dashboard/MarketingUserDashboardPage'
import About from './pages/About'
import Home from './pages/Home'
import LegalAiAssistantPage from './pages/Legal/LegalAiAssistantPage'
import LegalDashboardPage from './pages/Legal/LegalDashboardPage'
import LegalEvidenceUploadPage from './pages/Legal/LegalEvidenceUploadPage'
import LegalHelpPage from './pages/Legal/LegalHelpPage'
import LegalHomePage from './pages/Legal/LegalHomePage'
import LegalProgressPage from './pages/Legal/LegalProgressPage'
import LegalTaskDetailPage from './pages/Legal/LegalTaskDetailPage'
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
            path="/mentor-hub"
            element={<Navigate to="/mentor-hub/businessIdea" replace />}
          />
          <Route
            path="/mentor-hub/:domain"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <MentorHub />
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
            path="/toolkits/legal"
            element={
              <ProtectedRoute>
                <LegalHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toolkits/legal/dashboard"
            element={
              <ProtectedRoute>
                <LegalDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toolkits/legal/tasks/:taskId"
            element={
              <ProtectedRoute>
                <LegalTaskDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toolkits/legal/tasks/:taskId/evidence"
            element={
              <ProtectedRoute>
                <LegalEvidenceUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toolkits/legal/tasks/:taskId/help"
            element={
              <ProtectedRoute>
                <LegalHelpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toolkits/legal/progress"
            element={
              <ProtectedRoute>
                <LegalProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toolkits/legal/ai"
            element={
              <ProtectedRoute>
                <LegalAiAssistantPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mentor-approvals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMentorApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/marketing-development/articles"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMarketingDevelopmentArticlesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/marketing-development/templates"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMarketingDevelopmentTemplatesPage />
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







