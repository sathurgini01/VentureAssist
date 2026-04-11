import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { getAllProfiles, createProfile, deleteProfile, getIntelligenceReport } from '../../services/financeService'
import { useAppContext } from '../../context/AppContext'

export default function FinanceDashboardPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showIntModal, setShowIntModal] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState(null)
  const [report, setReport] = useState(null)
  
  const reportRef = useRef(null)

  const [formData, setFormData] = useState({
    startupName: '',
    initialCapital: '',
  })

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const data = await getAllProfiles()
      setProfiles(data)
    } catch (err) {
      addToast('error', 'Failed to fetch finance profiles')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createProfile({
        ...formData,
        initialCapital: Number(formData.initialCapital)
      })
      addToast('success', 'Profile created successfully')
      setShowCreateModal(false)
      setFormData({ startupName: '', initialCapital: '' })
      fetchProfiles()
    } catch (err) {
      addToast('error', err.message || 'Failed to create profile')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return
    try {
      await deleteProfile(id)
      addToast('success', 'Profile deleted')
      fetchProfiles()
    } catch (err) {
      addToast('error', 'Failed to delete profile')
    }
  }

  const handleIntelligence = async (id) => {
    try {
      setSelectedProfileId(id)
      setShowIntModal(true)
      const data = await getIntelligenceReport(id)
      setReport(data)
    } catch (err) {
      addToast('error', 'Failed to generate report')
      setShowIntModal(false)
    }
  }

  const handleExportPDF = async () => {
    if (!reportRef.current) return
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Finance_Report_${report?.profile?.startupName || 'Business'}.pdf`)
      addToast('success', 'PDF exported successfully')
    } catch (err) {
      addToast('error', 'Failed to export PDF')
    }
  }

  return (
    <div className="finance-dashboard">
      <header className="finance-header">
        <div>
          <h1>Finance Dashboard</h1>
          <p style={{ opacity: 0.8 }}>Manage your financial profiles and monitor your startup's financial health</p>
        </div>
        <div className="finance-header-nav">
          <Link to="/finance-dashboard/exchange" className="finance-nav-link">Currency & Markets</Link>
          <Link to="/" className="finance-nav-link">Back to Home</Link>
        </div>
      </header>

      <main className="finance-container">
        <div className="finance-actions">
          <button className="finance-btn" onClick={() => setShowCreateModal(true)}>
            + Create Profile
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid var(--finance-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <h3>No Finance Profiles Found</h3>
            <p className="finance-text-muted">Create your first financial profile to start tracking expenses and revenue.</p>
          </div>
        ) : (
          <div className="finance-profile-grid">
            {profiles.map(profile => (
              <div key={profile._id} className="finance-card">
                <h3>{profile.startupName}</h3>
                
                <div className="finance-card-stats">
                  <div className="finance-stat">
                    <span className="finance-stat-label">Initial Capital</span>
                    <span className="finance-stat-value">LKR {profile.initialCapital.toLocaleString()}</span>
                  </div>
                  <div className="finance-stat">
                    <span className="finance-stat-label">Monthly Revenue</span>
                    <span className="finance-stat-value" style={{ color: 'var(--finance-success)' }}>
                      +LKR {profile.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="finance-stat">
                    <span className="finance-stat-label">Monthly Expenses</span>
                    <span className="finance-stat-value" style={{ color: 'var(--finance-danger)' }}>
                      -LKR {profile.monthlyExpenses.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="finance-card-actions" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="finance-btn finance-btn-secondary" onClick={() => navigate(`/finance-dashboard/${profile._id}`)}>
                    Manage
                  </button>
                  <button className="finance-btn finance-btn-secondary" onClick={() => navigate(`/finance-dashboard/breakeven/${profile._id}`)}>
                    Break-Even
                  </button>
                  <button className="finance-btn finance-btn-secondary" onClick={() => handleIntelligence(profile._id)}>
                    Intelligence
                  </button>
                  <button className="finance-btn finance-btn-danger" onClick={() => handleDelete(profile._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="finance-modal-overlay">
          <div className="finance-modal">
            <h2>Create Finance Profile</h2>
            <form onSubmit={handleCreate}>
              <div className="finance-form-group">
                <label>Startup Name</label>
                <input 
                  type="text" 
                  value={formData.startupName} 
                  onChange={e => setFormData({...formData, startupName: e.target.value})} 
                  required 
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="finance-form-group">
                <label>Initial Capital (LKR)</label>
                <input 
                  type="number" 
                  value={formData.initialCapital} 
                  onChange={e => setFormData({...formData, initialCapital: e.target.value})} 
                  required 
                  min="0"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="finance-btn finance-btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="finance-btn" style={{ flex: 1 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intelligence Modal */}
      {showIntModal && (() => {
        const currentProfile = profiles.find(p => p._id === selectedProfileId)
        return (
        <div className="finance-modal-overlay">
          <div className="finance-modal finance-modal-large" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Financial Intelligence</h2>
              <div>
                <button className="finance-btn finance-btn-secondary" style={{ marginRight: '0.5rem' }} onClick={handleExportPDF}>
                  Export PDF
                </button>
                <button className="finance-btn finance-btn-secondary" onClick={() => setShowIntModal(false)}>
                  Close
                </button>
              </div>
            </div>
            
            {!report ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Analyzing financial data...</div>
            ) : (
              <div ref={reportRef} id="printable-intelligence" style={{ padding: '1rem', background: 'white' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--finance-accent)', paddingBottom: '1rem' }}>
                  <h1 style={{ color: 'var(--finance-primary-dark)', margin: '0 0 0.5rem 0' }}>{currentProfile?.startupName}</h1>
                  <h3 style={{ color: 'var(--finance-text-muted)', margin: 0 }}>System Generated Overview</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--finance-card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--finance-border)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--finance-primary)' }}>Current Status</h4>
                    <div className="finance-stat"><span className="finance-stat-label">Initial Capital</span><span style={{ fontWeight: 600 }}>LKR {currentProfile?.initialCapital?.toLocaleString()}</span></div>
                    <div className="finance-stat"><span className="finance-stat-label">Burn Rate</span><span style={{ color: 'var(--finance-danger)', fontWeight: 600 }}>LKR {report.burnRate?.toLocaleString()}</span></div>
                    <div className="finance-stat"><span className="finance-stat-label">Runway</span><span style={{ fontWeight: 600 }}>{report.runway}</span></div>
                  </div>
                  <div style={{ background: 'var(--finance-success-light)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--finance-success)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--finance-success)' }}>Health Score: {report.financialHealthScore}/100</h4>
                    <div style={{ fontWeight: 600, color: 'var(--finance-primary-dark)', marginBottom: '1rem' }}>Risk Level: {report.riskLevel}</div>
                    <p style={{ margin: 0, lineHeight: 1.6, fontStyle: 'italic', fontSize: '0.95rem' }}>"{report.advice}"</p>
                  </div>
                </div>

                <h3 style={{ borderBottom: '1px solid var(--finance-border)', paddingBottom: '0.5rem' }}>Financial History & Projections</h3>
                <table className="finance-table" style={{ width: '100%', marginTop: '1rem' }}>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Revenue Recorded</td>
                      <td>LKR {report.totalRevenue?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Total Expenses Recorded</td>
                      <td>LKR {report.totalExpenses?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Profit Margin</td>
                      <td style={{ color: report.profitMargin >= 0 ? 'var(--finance-success)' : 'var(--finance-danger)' }}>
                        {report.profitMargin}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        )
      })()}
    </div>
  )
}
