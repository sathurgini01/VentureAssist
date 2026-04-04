import Button from '../../components/Button'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

function AdminMentorApprovalPage() {
  const { mentorApplications, reviewMentorApplication } = useAppContext()

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack">
          <div>
            <p className="page-kicker">Admin Workspace</p>
            <h1 className="page-title">Mentor Approve</h1>
            <p className="page-subtitle">Approve or reject user requests to become mentors.</p>
          </div>

          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'expertise', label: 'Expertise' },
              { key: 'experience', label: 'Experience' },
              { key: 'appliedDate', label: 'Applied Date' },
              { key: 'status', label: 'Status' },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <div className="inline-actions">
                    <Button onClick={() => reviewMentorApplication(row.id, 'Approved')}>Approve</Button>
                    <Button variant="secondary" onClick={() => reviewMentorApplication(row.id, 'Rejected')}>
                      Reject
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={mentorApplications}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminMentorApprovalPage
