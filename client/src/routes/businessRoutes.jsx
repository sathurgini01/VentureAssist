import { Route } from 'react-router-dom'
import BusinessLayout from '../layouts/BusinessLayout'
import BusinessHomePage from '../modules/business/pages/BusinessHomePage'
import BusinessBecomeMentorPage from '../modules/business/pages/BusinessBecomeMentorPage'
import BusinessIdeaDetailPage from '../modules/business/pages/BusinessIdeaDetailPage'
import BusinessIdeaFormPage from '../modules/business/pages/BusinessIdeaFormPage'
import BusinessIdeasListPage from '../modules/business/pages/BusinessIdeasListPage'
import BusinessMentorRequestsPage from '../modules/business/pages/BusinessMentorRequestsPage'
import BusinessMentorsPage from '../modules/business/pages/BusinessMentorsPage'
import BusinessMentorDetailPage from '../modules/business/pages/BusinessMentorDetailPage'
import BusinessSwotPage from '../modules/business/pages/BusinessSwotPage'
import BusinessToolkitDetailPage from '../modules/business/pages/BusinessToolkitDetailPage'
import BusinessToolkitsPage from '../modules/business/pages/BusinessToolkitsPage'
import BusinessTrackerPage from '../modules/business/pages/BusinessTrackerPage'

const businessRoutes = (
  <Route path="/business" element={<BusinessLayout />}>
    <Route index element={<BusinessHomePage />} />
    <Route path="ideas/new" element={<BusinessIdeaFormPage />} />
    <Route path="ideas" element={<BusinessIdeasListPage />} />
    <Route path="ideas/:id" element={<BusinessIdeaDetailPage />} />
    <Route path="ideas/:id/swot" element={<BusinessSwotPage />} />
    <Route path="toolkits" element={<BusinessToolkitsPage />} />
    <Route path="toolkits/:toolkitId" element={<BusinessToolkitDetailPage />} />
    <Route path="mentors" element={<BusinessMentorsPage />} />
    <Route path="mentors/:mentorId" element={<BusinessMentorDetailPage />} />
    <Route path="become-mentor" element={<BusinessBecomeMentorPage />} />
    <Route path="mentor-requests" element={<BusinessMentorRequestsPage />} />
    <Route path="ideas/:id/tracker" element={<BusinessTrackerPage />} />
  </Route>
)

export default businessRoutes
