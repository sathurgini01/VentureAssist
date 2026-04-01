import '../styles/Cards.css'

function Card({ children, title, subtitle, actions = null }) {
  return (
    <section className="card">
      {title ? <h3 className="card-title">{title}</h3> : null}
      {subtitle ? <p className="card-muted">{subtitle}</p> : null}
      {actions}
      {children}
    </section>
  )
}

export default Card
