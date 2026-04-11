import Button from '../../components/Button'
import { useState } from 'react'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

const compactButtonStyle = {
  minHeight: '32px',
  padding: '0.4rem 0.8rem',
  fontSize: '0.8rem',
  boxShadow: 'none',
}

function AdminMentorApprovalPage() {
  const [notes, setNotes] = useState({})
  const { mentorApplications, reviewMentorApplication, removeMentorApplication } = useAppContext()

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
              {
                key: 'applicant',
                label: 'Applicant',
                render: (_, row) => (
                  <div style={{ minWidth: '150px' }}>
                    <strong>{row.name}</strong>
                    <div className="card-muted">{row.email}</div>
                    <div className="card-muted">{row.phoneNumber || 'No phone number'}</div>
                  </div>
                ),
              },
              {
                key: 'details',
                label: 'Details',
                render: (_, row) => (
                  <div style={{ minWidth: '280px', maxWidth: '340px' }}>
                    <div><strong>Expertise:</strong> {row.expertise || 'Not provided'}</div>
                    <div><strong>Qualification:</strong> {row.qualification || 'Not provided'}</div>
                    <div><strong>Experience:</strong> {row.experience || 'Not provided'}</div>
                    <div><strong>Bio:</strong> {row.bio || 'Not provided'}</div>
                  </div>
                ),
              },
              {
                key: 'statusInfo',
                label: 'Status',
                render: (_, row) => (
                  <div style={{ minWidth: '120px' }}>
                    <div><strong>{row.status}</strong></div>
                    <div className="card-muted">{row.appliedDate}</div>
                    <div className="card-muted">{row.adminNote || 'No admin note yet'}</div>
                  </div>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  row.status === 'pending' ? (
                    <div className="section-stack" style={{ minWidth: '180px' }}>
                      <input
                        className="form-control"
                        placeholder="Admin note"
                        value={notes[row.id] || ''}
                        onChange={(event) => setNotes((current) => ({ ...current, [row.id]: event.target.value }))}
                      />
                      <div className="inline-actions">
                        <Button
                          onClick={() => reviewMentorApplication(row.id, 'Approved', notes[row.id] || '')}
                          style={{ ...compactButtonStyle, background: '#16a34a', color: '#fff' }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => reviewMentorApplication(row.id, 'Rejected', notes[row.id] || '')}
                          style={{ ...compactButtonStyle, background: '#dc2626', color: '#fff' }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ minWidth: '90px' }}>
                      <Button
                        variant="secondary"
                        onClick={() => removeMentorApplication(row.id)}
                        style={{ ...compactButtonStyle, background: '#dc2626', color: '#fff' }}
                      >
                        Delete
                      </Button>
                    </div>
                  )
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
