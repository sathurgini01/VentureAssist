import { useMemo, useState } from 'react'
import Button from '../../components/Button'
import MentorCard from '../../components/MarketingMentorCard'
import Modal from '../../components/Modal'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function Mentors() {
  const { mentors, searchQuery, filters, setFilters, bookMentorSession, addToast } = useAppContext()
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    topic: '',
    preferredDateTime: '',
    message: '',
  })

  const filteredMentors = useMemo(
    () =>
      mentors
        .filter((mentor) =>
          `${mentor.name} ${mentor.title} ${mentor.expertise.join(' ')}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
        .filter((mentor) =>
          filters.expertise === 'all'
            ? true
            : mentor.expertise.some((item) => item.toLowerCase().includes(filters.expertise.toLowerCase())),
        ),
    [mentors, searchQuery, filters.expertise],
  )

  const closeBookingModal = () => {
    setSelectedMentor(null)
    setBookingForm({
      topic: '',
      preferredDateTime: '',
      message: '',
    })
  }

  const handleBookingSubmit = (event) => {
    event.preventDefault()

    if (!selectedMentor) {
      return
    }

    if (!bookingForm.topic.trim() || !bookingForm.preferredDateTime.trim()) {
      addToast('Session topic and preferred date/time are required.', 'warning')
      return
    }

    bookMentorSession(selectedMentor, {
      topic: bookingForm.topic.trim(),
      preferredDateTime: bookingForm.preferredDateTime,
      message: bookingForm.message.trim(),
    })

    closeBookingModal()
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <section className="mentor-showcase">
            <div className="mentor-showcase-copy card">
              <p className="page-kicker">Mentor Network</p>
              <h1 className="page-title">Find the right mentor for your next move</h1>
              <p className="page-subtitle">
                Explore specialists in fundraising, growth, and product strategy, then send a focused booking request.
              </p>
              <div className="mentor-highlight-metrics">
                <div className="mentor-highlight-stat">
                  <strong>{mentors.length}</strong>
                  <span className="card-muted">Available mentors</span>
                </div>
                <div className="mentor-highlight-stat">
                  <strong>4.9</strong>
                  <span className="card-muted">Average rating</span>
                </div>
                <div className="mentor-highlight-stat">
                  <strong>24h</strong>
                  <span className="card-muted">Typical response</span>
                </div>
              </div>
            </div>
            <div className="mentor-spotlight card">
              <span className="badge">Featured Match</span>
              <h3 className="card-title">High-conviction guidance for founders</h3>
              <p className="card-muted">
                Book sessions around pitch reviews, growth experiments, founder storytelling, and product positioning.
              </p>
              <div className="tag-row">
                <span className="tag-chip">Pitch Decks</span>
                <span className="tag-chip">Go-to-market</span>
                <span className="tag-chip">Retention</span>
              </div>
            </div>
          </section>

          <div className="toolbar-row">
            <input className="search-input" placeholder="Search mentors by name or expertise" value={searchQuery} readOnly />
            <select
              className="form-control"
              value={filters.expertise}
              onChange={(event) =>
                setFilters((current) => ({ ...current, expertise: event.target.value }))
              }
            >
              <option value="all">All expertise</option>
              <option value="fundraising">Fundraising</option>
              <option value="growth">Growth</option>
              <option value="product">Product</option>
            </select>
          </div>

          <div className="mentor-layout">
            <div className="filter-panel card">
              <div className="filter-panel-header">
                <strong>Refine results</strong>
                <p className="card-muted">Narrow by expertise, availability, and pricing.</p>
              </div>
              <div className="filter-section">
                <strong>Expertise</strong>
                <div className="tag-row">
                  <span className="tag-chip">Fundraising</span>
                  <span className="tag-chip">Growth</span>
                  <span className="tag-chip">Product</span>
                </div>
              </div>
              <div className="filter-section">
                <strong>Availability</strong>
                <div className="tag-row">
                  <span className="tag-chip">This Week</span>
                  <span className="tag-chip">Weekends</span>
                </div>
              </div>
              <div className="filter-section">
                <strong>Rating</strong>
                <p className="card-muted">4.5+ stars</p>
              </div>
              <div className="filter-section">
                <strong>Price</strong>
                <p className="card-muted">$50 - $100 / hour</p>
              </div>
            </div>

            <div className="mentor-grid">
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onViewProfile={() => addToast(`Viewing ${mentor.name}.`)}
                  onBookSession={() => setSelectedMentor(mentor)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={Boolean(selectedMentor)} title={`Book Session${selectedMentor ? ` with ${selectedMentor.name}` : ''}`}>
        <form className="section-stack" onSubmit={handleBookingSubmit}>
          <div className="form-group">
            <label htmlFor="booking-topic">Session Topic</label>
            <input
              id="booking-topic"
              className="form-control"
              value={bookingForm.topic}
              onChange={(event) =>
                setBookingForm((current) => ({ ...current, topic: event.target.value }))
              }
              placeholder="Pitch deck review, growth planning, product strategy"
            />
          </div>
          <div className="form-group">
            <label htmlFor="booking-datetime">Preferred Date & Time</label>
            <input
              id="booking-datetime"
              type="datetime-local"
              className="form-control"
              value={bookingForm.preferredDateTime}
              onChange={(event) =>
                setBookingForm((current) => ({ ...current, preferredDateTime: event.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="booking-message">Optional Message</label>
            <textarea
              id="booking-message"
              className="form-control"
              rows="4"
              value={bookingForm.message}
              onChange={(event) =>
                setBookingForm((current) => ({ ...current, message: event.target.value }))
              }
              placeholder="Share context or goals for the session"
            />
          </div>
          <div className="inline-actions">
            <Button type="submit">Submit Request</Button>
            <Button variant="secondary" onClick={closeBookingModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Mentors

