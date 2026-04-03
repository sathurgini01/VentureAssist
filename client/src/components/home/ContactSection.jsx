import { useState } from 'react'

function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section className="home-section contact-section" id="contact">
      <div className="home-container contact-layout">
        <div className="contact-copy">
          <span className="section-label">CONTACT US</span>
          <h2>Talk to the Venture Assist team</h2>
          <p>
            Have a question about the platform, partnerships, or how Venture Assist can support your startup journey? Send us a quick message.
          </p>
          <div className="contact-mini-cards">
            <article className="contact-mini-card">
              <strong>Email</strong>
              <span>hello@ventureassist.app</span>
            </article>
            <article className="contact-mini-card">
              <strong>Support</strong>
              <span>Mon - Fri · 9 AM to 6 PM</span>
            </article>
          </div>
        </div>

        <form className="contact-form-card" onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <label className="contact-field">
              <span>Name</span>
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label className="contact-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label className="contact-field contact-field-full">
              <span>Message</span>
              <textarea name="message" rows="4" placeholder="How can we help?" required />
            </label>
          </div>
          <div className="contact-form-actions">
            <button type="submit" className="home-btn home-btn-primary">
              Send Message
            </button>
            {isSubmitted ? <small>Your message has been noted. We’ll get back to you soon.</small> : null}
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactSection
