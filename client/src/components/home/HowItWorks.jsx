const steps = [
  {
    number: '1',
    title: 'Sign Up & Create Profile',
    description: 'Start with your venture stage, goals, and business context so the platform can shape the right path forward.',
  },
  {
    number: '2',
    title: 'Explore Your Modules',
    description: 'Move through tailored tools for campaigns, templates, mentoring, scheduling, and strategic planning.',
  },
  {
    number: '3',
    title: 'Engage & Track Progress',
    description: 'Use guidance, AI prompts, and milestone tracking to turn scattered effort into a consistent operating rhythm.',
  },
  {
    number: '4',
    title: 'Grow Your Business',
    description: 'Launch with more confidence, refine faster, and keep building traction with support that grows with you.',
  },
]

function HowItWorks() {
  return (
    <section className="home-section how-section" id="how-it-works">
      <div className="home-container">
        <div className="section-heading centered">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Your journey from idea to growing business</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article key={step.number} className="home-card step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
