const testimonials = [
  {
    quote: 'Venture Assist helped us move from scattered planning into a real growth system we actually use every week.',
    name: 'Amara Silva',
    role: 'Founder, Luna Naturals',
    initial: 'A',
    tone: 'teal',
  },
  {
    quote: 'The mentor sessions and campaign tools gave us confidence to launch faster and sound far more polished in-market.',
    name: 'Daniel Perera',
    role: 'Co-founder, Orbit Labs',
    initial: 'D',
    tone: 'amber',
  },
  {
    quote: 'It feels like a smart operating hub for early-stage teams that want structure without losing speed.',
    name: 'Maya Fernando',
    role: 'Founder, Studio Grove',
    initial: 'M',
    tone: 'coral',
  },
]

function Testimonials() {
  return (
    <section className="home-section testimonials-section" id="testimonials">
      <div className="home-container">
        <div className="section-heading centered">
          <span className="section-label">STORIES</span>
          <h2>Trusted by founders building with intention</h2>
        </div>

        <div className="testimonials-grid" id="stories">
          {testimonials.map((item) => (
            <article key={item.name} className="home-card testimonial-card">
              <div className="stars">★★★★★</div>
              <span className="quote-mark">“</span>
              <p>{item.quote}</p>
              <div className="testimonial-author">
                <span className={`author-avatar author-avatar-${item.tone}`}>{item.initial}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
