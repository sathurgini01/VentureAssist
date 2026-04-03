import Button from './Button'
import '../styles/Cards.css'
import Card from './Card'
import '../styles/MarketingDashboard.css'

function MentorCard({ mentor, onViewProfile, onBookSession }) {
  return (
    <div className="mentor-card-shell">
      <Card>
        <div className="mentor-card-top">
          <div className="mentor-photo">{mentor.photo}</div>
          <span className="mentor-price-pill">{mentor.rate}</span>
        </div>
        <div className="mentor-header">
          <h3 className="card-title">{mentor.name}</h3>
          <div>
            <p className="card-muted">{mentor.title}</p>
            <div className="rating-row">
              <span className="star-row">*****</span>
              <span>{mentor.rating} ({mentor.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div className="tag-row">
          {mentor.expertise.map((item) => (
            <span key={item} className="tag-chip">{item}</span>
          ))}
        </div>
        <div className="mentor-meta-row">
          <p className="card-muted">Availability: {mentor.availability}</p>
          <span className="mentor-match-badge">Top match</span>
        </div>
        <div className="inline-actions mentor-actions">
          <Button variant="secondary" onClick={() => onViewProfile?.(mentor)}>
            View Profile
          </Button>
          <Button onClick={() => onBookSession?.(mentor)}>
            Book Session
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default MentorCard

