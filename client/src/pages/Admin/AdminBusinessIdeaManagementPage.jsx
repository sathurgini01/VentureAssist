import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'
import { deleteMentor, deleteToolkit, getMentors, getToolkits } from '../../modules/business/services/businessService'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

function AdminBusinessIdeaManagementPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [mentors, setMentors] = useState([])
  const [toolkits, setToolkits] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [mentorData, toolkitData] = await Promise.all([getMentors(), getToolkits()])
      setMentors(mentorData)
      setToolkits(toolkitData)
    } catch (error) {
      addToast(error.message || 'Failed to load business idea management data.', 'error')
    }
  }

  async function handleMentorDelete(mentorId) {
    if (!window.confirm('Delete this mentor?')) {
      return
    }

    try {
      await deleteMentor(mentorId)
      addToast('Mentor deleted successfully.', 'success')
      await loadData()
    } catch (error) {
      addToast(error.message || 'Failed to delete mentor.', 'error')
    }
  }

  async function handleToolkitDelete(toolkitId) {
    if (!window.confirm('Delete this toolkit?')) {
      return
    }

    try {
      await deleteToolkit(toolkitId)
      addToast('Toolkit deleted successfully.', 'success')
      await loadData()
    } catch (error) {
      addToast(error.message || 'Failed to delete toolkit.', 'error')
    }
  }

  const mentorRows = useMemo(
    () =>
      mentors.map((mentor) => ({
        ...mentor,
        id: mentor._id,
      })),
    [mentors],
  )

  const toolkitRows = useMemo(
    () =>
      toolkits.map((toolkit) => ({
        ...toolkit,
        id: toolkit._id,
        name: toolkit.name || toolkit.title,
        relatedIdea: toolkit.relatedBusinessIdeaTitle || 'General toolkit',
        resource: toolkit.resourceType === 'link' ? 'Link' : toolkit.fileName || 'PDF',
      })),
    [toolkits],
  )

  const adminActionButtonStyle = {
    minHeight: '34px',
    padding: '0.45rem 0.9rem',
    fontSize: '0.82rem',
    boxShadow: 'none',
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack admin-dashboard-surface">
          <Card title="Business Idea Management" subtitle="Manage mentors and toolkits for the business module.">
            <div className="inline-actions">
              <Button onClick={() => navigate('/admin/business-idea-management/mentors/new')}>
                Add Mentor
              </Button>
              <Button onClick={() => navigate('/admin/business-idea-management/toolkits/new')}>
                Add Toolkits
              </Button>
            </div>
          </Card>

          <Card title="Mentors Details">
            <Table
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phoneNumber', label: 'Phone Number' },
                { key: 'expertise', label: 'Expertise' },
                { key: 'bio', label: 'Short Bio / About' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <div className="inline-actions">
                      <Button
                        onClick={() => navigate(`/admin/business-idea-management/mentors/${row._id}/edit`)}
                        style={{ ...adminActionButtonStyle, background: '#16a34a', color: '#fff' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleMentorDelete(row._id)}
                        style={{ ...adminActionButtonStyle, background: '#dc2626', color: '#fff' }}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={mentorRows}
              emptyMessage="No mentors added yet."
            />
          </Card>

          <Card title="Toolkits Details">
            <Table
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'description', label: 'Description' },
                { key: 'relatedIdea', label: 'Related Business Idea' },
                { key: 'resource', label: 'File / Resource' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <div className="inline-actions">
                      <Button
                        onClick={() => navigate(`/admin/business-idea-management/toolkits/${row._id}/edit`)}
                        style={{ ...adminActionButtonStyle, background: '#16a34a', color: '#fff' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleToolkitDelete(row._id)}
                        style={{ ...adminActionButtonStyle, background: '#dc2626', color: '#fff' }}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={toolkitRows}
              emptyMessage="No toolkits added yet."
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminBusinessIdeaManagementPage
