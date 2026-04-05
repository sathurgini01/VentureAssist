const platformLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Modules', href: '#modules' },
  { label: 'Mentorship', href: '#testimonials' },
  { label: 'Stories', href: '#stories' },
]

const companyLinks = ['About Venture Assist', 'Partners', 'Careers', 'Contact']
const legalLinks = ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Accessibility']

function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-container footer-grid">
        <div className="footer-brand">
          <div className="home-brand footer-brand-lockup">
            <span className="home-brand-mark">VA</span>
            <span className="home-brand-copy">
              <strong>Venture Assist</strong>
              <small>Business Platform</small>
            </span>
          </div>
          <p>
            A guided platform for founders who want practical structure, expert support, and smarter tools while building their next stage of growth.
          </p>
          <div className="footer-socials" aria-label="Social links">
            <a href="#top" aria-label="Instagram">
              ig
            </a>
            <a href="#top" aria-label="LinkedIn">
              in
            </a>
            <a href="#top" aria-label="X">
              x
            </a>
          </div>
        </div>

        <div>
          <h3>Platform</h3>
          <div className="footer-links">
            {platformLinks.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3>Company</h3>
          <div className="footer-links">
            {companyLinks.map((item) => (
              <a key={item} href="#top">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3>Legal</h3>
          <div className="footer-links">
            {legalLinks.map((item) => (
              <a key={item} href="#top">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="home-container footer-bottom">
        <p>© 2026 Venture Assist. All rights reserved.</p>
        <p>Built to help early ventures move with clarity.</p>
      </div>
    </footer>
  )
}

export default Footer
