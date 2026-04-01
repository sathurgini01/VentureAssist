import '../styles/Cards.css'
import Card from './Card'

function StatsCard({
  label,
  title,
  value,
  helper,
  trend,
}) {
  const displayLabel = title || label || 'Metric'
  const displayHelper = trend || helper || 'Mock metric'

  return (
    <Card>
      <p className="card-muted">{displayLabel}</p>
      <h2 className="metric-value">{value}</h2>
      <span className="badge">{displayHelper}</span>
    </Card>
  )
}

export default StatsCard
