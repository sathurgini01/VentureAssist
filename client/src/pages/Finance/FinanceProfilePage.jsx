import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProfileById } from '../../services/financeService'
import { getExpenses, addExpense, deleteExpense } from '../../services/expenseService'
import { getRevenue, addRevenue, deleteRevenue } from '../../services/revenueService'
import { useAppContext } from '../../context/AppContext'

export default function FinanceProfilePage() {
  const { profileId } = useParams()
  const { addToast } = useAppContext()
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('expenses')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    category: '', // for expense
    source: '',
    amount: '',
    description: ''
  })

  useEffect(() => {
    fetchData()
  }, [profileId, activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (!profile) {
        const pData = await getProfileById(profileId)
        setProfile(pData)
      }

      if (activeTab === 'expenses') {
        const expData = await getExpenses(profileId)
        setItems(expData)
      } else {
        const revData = await getRevenue(profileId)
        setItems(revData)
      }
    } catch (err) {
      addToast('error', 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      if (activeTab === 'expenses') {
        await addExpense({
          profileId,
          category: formData.category,
          amount: Number(formData.amount),
          description: formData.description
        })
        addToast('success', 'Expense added')
      } else {
        await addRevenue({
          profileId,
          source: formData.source,
          amount: Number(formData.amount)
        })
        addToast('success', 'Revenue added')
      }
      setFormData({ category: '', source: '', amount: '', description: '' })
      fetchData()
    } catch (err) {
      addToast('error', 'Failed to add record')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return
    try {
      if (activeTab === 'expenses') {
        await deleteExpense(id)
        addToast('success', 'Expense deleted')
      } else {
        await deleteRevenue(id)
        addToast('success', 'Revenue deleted')
      }
      fetchData()
    } catch (err) {
      addToast('error', 'Failed to delete record')
    }
  }

  return (
    <div className="finance-dashboard">
      <header className="finance-header">
        <div>
          <h1>{profile ? profile.startupName : 'Loading...'}</h1>
          <p style={{ opacity: 0.8 }}>Manage records and track financial health</p>
        </div>
        <div className="finance-header-nav">
          <Link to={`/finance-dashboard/breakeven/${profileId}`} className="finance-nav-link">Break-Even Calc</Link>
          <Link to="/finance-dashboard" className="finance-nav-link">Dashboard</Link>
        </div>
      </header>

      <main className="finance-container">

        <div className="finance-tabs">
          <button
            className={`finance-tab ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses Tracker
          </button>
          <button
            className={`finance-tab ${activeTab === 'revenues' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenues')}
          >
            Revenue Tracker
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>

          {/* Add Form */}
          <div className="finance-card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--finance-text)' }}>
              Add {activeTab === 'expenses' ? 'Expense' : 'Revenue'}
            </h3>
            <form onSubmit={handleAdd}>
              {activeTab === 'expenses' ? (
                <>
                  <div className="finance-form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      required
                      placeholder="e.g. Marketing, Rent..."
                    />
                  </div>
                  <div className="finance-form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Details about expense"
                      rows="3"
                    ></textarea>
                  </div>
                </>
              ) : (
                <div className="finance-form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                    required
                    placeholder="e.g. Product Sale, Investment..."
                  />
                </div>
              )}

              <div className="finance-form-group">
                <label>Amount (LKR)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>

              <button type="submit" className="finance-btn" style={{ width: '100%', justifyContent: 'center' }}>
                + Add Record
              </button>
            </form>
          </div>

          {/* Data Table */}
          <div className="finance-table-container">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading records...</div>
            ) : items.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--finance-text-muted)' }}>
                No {activeTab} recorded yet. added your first record using the form.
              </div>
            ) : (
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>{activeTab === 'expenses' ? 'Category' : 'Source'}</th>
                    <th>Amount</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td>{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{activeTab === 'expenses' ? item.category : item.source}</div>
                        {item.description && <div style={{ fontSize: '0.8rem', color: 'var(--finance-text-muted)' }}>{item.description}</div>}
                      </td>
                      <td style={{
                        color: activeTab === 'expenses' ? 'var(--finance-danger)' : 'var(--finance-success)',
                        fontWeight: 600
                      }}>
                        LKR {item.amount.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="finance-btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: 'none', color: 'var(--finance-danger)' }} onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
