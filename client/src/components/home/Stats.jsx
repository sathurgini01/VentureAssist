const stats = [
  { value: '2,400+', label: 'Founders Supported' },
  { value: '180+', label: 'Active Mentors' },
  { value: '500+', label: 'Marketing Templates' },
  { value: '95%', label: 'Satisfaction Rate' },
]

function renderValue(value) {
  const firstCharacter = value.slice(0, 1)
  const remainder = value.slice(1)

  return (
    <>
      <span className="accent-digit">{firstCharacter}</span>
      {remainder}
    </>
  )
}

function Stats() {
  return (
    <section className="stats-section" aria-label="Platform statistics">
      <div className="home-container stats-grid">
        {stats.map((item) => (
          <article key={item.label} className="stat-item">
            <h3>{renderValue(item.value)}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Stats
