import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBreakEven } from '../../services/financeService'
import { useAppContext } from '../../context/AppContext'

export default function BreakEvenPage() {
  const { profileId } = useParams()
  const { addToast } = useAppContext()
  const [months, setMonths] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculate = async () => {
    try {
      setLoading(true)
      const data = await getBreakEven(profileId)
      setMonths(data.breakEvenMonths)
      addToast('success', 'Break-even calculated successfully')
    } catch (err) {
      addToast('error', err.message || 'Failed to calculate break-even')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (decimalMonths) => {
    if (decimalMonths === -1) return 'Never'
    const totalDays = Math.round(decimalMonths * 30)
    const m = Math.floor(totalDays / 30)
    const d = totalDays % 30

    if (m === 0) return `${d} Days`
    if (d === 0) return `${m} Months`
    return `${m} Months, ${d} Days`
  }

  return (
    <div className="finance-dashboard">
      <header className="finance-header">
        <div>
          <h1>Break-Even Calculator</h1>
          <p style={{ opacity: 0.8 }}>Predict when your startup will become profitable</p>
        </div>
        <div className="finance-header-nav">
          <Link to={`/finance-dashboard/${profileId}`} className="finance-nav-link">Back to Profile</Link>
          <Link to="/finance-dashboard" className="finance-nav-link">Dashboard</Link>
        </div>
      </header>

      <main className="finance-container">
        <div className="finance-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h3>Calculate Break-Even Point</h3>
          <p className="finance-stat-label" style={{ marginBottom: '2rem' }}>
            This tool uses your profile's initial capital, monthly revenue, and monthly expenses to calculate how many months it will take to break even.
          </p>

          <button
            className="finance-btn"
            onClick={calculate}
            disabled={loading}
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            {loading ? 'Calculating...' : 'Calculate Now'}
          </button>

          {months !== null && (
            <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'var(--finance-success-light)', borderRadius: '12px' }}>
              <h2 style={{ color: 'var(--finance-success)', margin: '0 0 1rem 0', fontSize: '2.5rem' }}>
                {formatTime(months)}
              </h2>
              <p style={{ color: 'var(--finance-primary-dark)', margin: 0, fontWeight: 500 }}>
                {months === -1
                  ? 'Your expenses currently exceed your revenue. You will not break even unless you increase revenue or cut expenses.'
                  : 'Estimated time to recover your initial capital.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

//updated

