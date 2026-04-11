import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getExchangeRate } from '../../services/financeService'
import { useAppContext } from '../../context/AppContext'

// Hardcoded realistic mock news
const MOCK_NEWS = [
  { id: 1, title: 'Central Bank Adjusts Interest Rates, Impacting Local Currency', source: 'Financial Times', date: '2 hours ago' },
  { id: 2, title: 'Global Tech Stocks Rally as USD Holds Steady', source: 'Bloomberg', date: '4 hours ago' },
  { id: 3, title: 'Export-Import Businesses Advised to Hedge Against LKR Volatility', source: 'CB News', date: '5 hours ago' },
  { id: 4, title: 'Asian Markets Show Mixed Results Amidst Currency Fluctuations', source: 'Reuters', date: '1 day ago' },
  { id: 5, title: 'Cryptocurrency Adoption on the Rise in Emerging Economies', source: 'CoinDesk', date: '1 day ago' },
]

export default function CurrencyExchangePage() {
  const { addToast } = useAppContext()
  const [fromCur, setFromCur] = useState('USD')
  const [toCur, setToCur] = useState('LKR')
  const [rate, setRate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [amt, setAmt] = useState(1);

  const handleConvert = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const data = await getExchangeRate(fromCur, toCur)
      setRate(data.rate)
    } catch (error) {
      addToast('error', 'Failed to fetch exchange rate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="finance-dashboard">
      <header className="finance-header">
        <div>
          <h1>Currency & Markets</h1>
          <p style={{ opacity: 0.8 }}>Live currency exchange and market news for your business</p>
        </div>
        <div className="finance-header-nav">
          <Link to="/finance-dashboard" className="finance-nav-link">Back to Dashboard</Link>
        </div>
      </header>

      <main className="finance-container">
        
        <div className="currency-grid">
          <div className="currency-widget">
            <h3>Currency Converter</h3>
            <p className="finance-stat-label" style={{ marginBottom: '1.5rem' }}>
              Convert currencies using real-time rates from our backend service. Essential for managing international expenses and revenues.
            </p>
            
            <form onSubmit={handleConvert}>
              <div className="finance-form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  min="0.01" 
                  step="0.01"
                  value={amt} 
                  onChange={e => setAmt(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="finance-form-group" style={{ flex: 1 }}>
                  <label>From</label>
                  <select value={fromCur} onChange={e => setFromCur(e.target.value)}>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="LKR">LKR - Sri Lankan Rupee</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--finance-text-muted)' }}>⇄</span>
                </div>
                <div className="finance-form-group" style={{ flex: 1 }}>
                  <label>To</label>
                  <select value={toCur} onChange={e => setToCur(e.target.value)}>
                    <option value="LKR">LKR - Sri Lankan Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="finance-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Converting...' : 'Convert'}
              </button>
            </form>

            {rate !== null && (
              <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1.5rem', background: 'var(--finance-success-light)', borderRadius: '8px' }}>
                <div style={{ color: 'var(--finance-text-muted)', marginBottom: '0.5rem' }}>{amt} {fromCur} =</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--finance-primary-dark)' }}>
                  {((amt) * rate).toFixed(2)} {toCur}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--finance-text-muted)', marginTop: '0.5rem' }}>
                  1 {fromCur} = {rate.toFixed(4)} {toCur}
                </div>
              </div>
            )}
          </div>

          <div className="currency-news">
            <h3>Live Market News</h3>
            <p className="finance-stat-label" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Latest updates affecting global finance</span>
              <span style={{ color: 'var(--finance-accent)', fontSize: '0.8rem', fontWeight: 600 }}>● LIVE</span>
            </p>
            
            <div className="news-list">
              {MOCK_NEWS.map(news => (
                <div key={news.id} className="news-item">
                  <div className="news-title">{news.title}</div>
                  <div className="news-meta">{news.source} • {news.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
