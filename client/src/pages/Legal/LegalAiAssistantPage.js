import { useState } from 'react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { askLegalCompliance } from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalAiAssistantPage() {
  const { addToast } = useAppContext()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [disclaimer, setDisclaimer] = useState('')
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionHistory, setSessionHistory] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const data = await askLegalCompliance({ question })
      setAnswer(data.answer || '')
      setDisclaimer(data.disclaimer || '')
      setSource(data.source || '')
      setSessionHistory((current) => [{ question, answer: data.answer, createdAt: new Date().toISOString() }, ...current].slice(0, 5))
      setQuestion('')
    } catch (error) {
      addToast(error.message || 'Unable to generate legal guidance.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="dashboard-split legal-overview-grid">
            <Card title="AI Legal Assistant" subtitle="Ask legal and compliance questions in plain language.">
              <form className="legal-form-grid" onSubmit={handleSubmit}>
                <label className="form-group">
                  <span>Your Question</span>
                  <textarea
                    rows="7"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Example: What legal compliance areas should I check before hiring my first employee?"
                    required
                  />
                </label>
                <div className="inline-actions">
                  <Button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Ask Assistant'}</Button>
                </div>
              </form>
            </Card>

            <Card title="Suggested Questions" subtitle="Use these prompts to get practical legal guidance faster.">
              <div className="legal-chip-grid compact-chip-grid">
                {[
                  'What licences should I check before expanding to another branch?',
                  'What documents should I keep ready before hiring staff?',
                  'How should I organise my business compliance records?',
                  'What legal areas should a startup review before launching?'
                ].map((item) => (
                  <button key={item} type="button" className="legal-task-preview legal-preview-button" onClick={() => setQuestion(item)}>
                    <strong>{item}</strong>
                  </button>
                ))}
              </div>
            </Card>
          </section>

          <section className="dashboard-split legal-overview-grid">
            <Card title="Assistant Response" subtitle="AI-generated guidance for your question.">
              {answer ? (
                <div className="section-stack">
                  <div className="legal-ai-answer-box">{answer}</div>
                  {disclaimer ? <p className="card-muted">{disclaimer}</p> : null}
                  {source ? <span className="badge">Source: {source}</span> : null}
                </div>
              ) : (
                <p className="card-muted">Ask a question to see a response here.</p>
              )}
            </Card>

            <Card title="Recent Session History" subtitle="This session’s latest AI questions.">
              <div className="legal-progress-list">
                {sessionHistory.length > 0 ? sessionHistory.map((entry, index) => (
                  <div key={`${entry.createdAt}-${index}`} className="legal-progress-item session-history-item">
                    <div>
                      <strong>{entry.question}</strong>
                      <p className="card-muted">{entry.answer}</p>
                    </div>
                  </div>
                )) : <p className="card-muted">No AI questions asked in this session yet.</p>}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalAiAssistantPage
