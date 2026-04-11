import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { createToolkit, getIdeas, getToolkits, updateToolkit } from '../../modules/business/services/businessService'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

const initialForm = {
  name: '',
  description: '',
  relatedBusinessIdea: '',
  resourceType: 'pdf',
  resourceValue: '',
  fileName: '',
}

function AdminToolkitFormPage() {
  const navigate = useNavigate()
  const { toolkitId } = useParams()
  const { addToast } = useAppContext()
  const [ideas, setIdeas] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [toolkitId])

  async function loadData() {
    try {
      const [ideaData, toolkitData] = await Promise.all([getIdeas(), toolkitId ? getToolkits() : Promise.resolve([])])
      setIdeas(ideaData)

      if (toolkitId) {
        const toolkit = toolkitData.find((item) => item._id === toolkitId)
        if (toolkit) {
          setForm({
            name: toolkit.name || toolkit.title || '',
            description: toolkit.description || '',
            relatedBusinessIdea: toolkit.relatedBusinessIdea?._id || '',
            resourceType: toolkit.resourceType || 'link',
            resourceValue: toolkit.downloadUrl || '',
            fileName: toolkit.fileName || '',
          })
        }
      }
    } catch (error) {
      addToast(error.message || 'Failed to load toolkit form.', 'error')
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) {
      setForm((current) => ({ ...current, resourceValue: '', fileName: '' }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        resourceType: 'pdf',
        resourceValue: String(reader.result || ''),
        fileName: file.name,
      }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      relatedBusinessIdea: form.relatedBusinessIdea || null,
      resourceType: form.resourceType,
      downloadUrl: form.resourceValue.trim(),
      fileName: form.fileName,
    }

    try {
      setSaving(true)
      if (toolkitId) {
        await updateToolkit(toolkitId, payload)
        addToast('Toolkit updated successfully.', 'success')
      } else {
        await createToolkit(payload)
        addToast('Toolkit added successfully.', 'success')
      }
      navigate('/admin/business-idea-management')
    } catch (error) {
      addToast(error.message || 'Failed to save toolkit.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack admin-dashboard-surface">
          <Card title={toolkitId ? 'Edit Toolkit' : 'Add Toolkit'} subtitle="Fill the toolkit details below.">
            <form className="section-stack" onSubmit={handleSubmit}>
              <label className="form-label">
                Name
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>

              <label className="form-label">
                Description
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  required
                />
              </label>

              <label className="form-label">
                Related Business Idea
                <select
                  className="form-control"
                  value={form.relatedBusinessIdea}
                  onChange={(event) => setForm((current) => ({ ...current, relatedBusinessIdea: event.target.value }))}
                >
                  <option value="">General toolkit</option>
                  {ideas.map((idea) => (
                    <option key={idea._id} value={idea._id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-label">
                File / Resource
                <div className="inline-actions" style={{ marginTop: '0.75rem' }}>
                  <label className="checkbox-item">
                    <input
                      type="radio"
                      name="toolkit-resource-type"
                      checked={form.resourceType === 'pdf'}
                      onChange={() => setForm((current) => ({ ...current, resourceType: 'pdf', resourceValue: '', fileName: '' }))}
                    />
                    <span>Upload PDF</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="radio"
                      name="toolkit-resource-type"
                      checked={form.resourceType === 'link'}
                      onChange={() => setForm((current) => ({ ...current, resourceType: 'link', resourceValue: '', fileName: '' }))}
                    />
                    <span>Add Link</span>
                  </label>
                </div>
              </div>

              {form.resourceType === 'pdf' ? (
                <label className="form-label">
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control"
                    onChange={handleFileChange}
                    required={form.resourceType === 'pdf' && !form.resourceValue}
                  />
                  {form.fileName ? <span className="card-muted">{form.fileName}</span> : null}
                </label>
              ) : (
                <label className="form-label">
                  Resource URL
                  <input
                    type="url"
                    className="form-control"
                    value={form.resourceValue}
                    onChange={(event) => setForm((current) => ({ ...current, resourceValue: event.target.value }))}
                    required
                  />
                </label>
              )}

              <div className="inline-actions">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : toolkitId ? 'Update Toolkit' : 'Add Toolkit'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/admin/business-idea-management')}>
                  Back
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminToolkitFormPage
