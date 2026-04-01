import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import Modules from '../components/home/Modules'
import Stats from '../components/home/Stats'
import Testimonials from '../components/home/Testimonials'
import CTASection from '../components/home/CTASection'
import ContactSection from '../components/home/ContactSection'
import Footer from '../components/home/Footer'
import '../styles/home.css'

function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Modules />
      <Stats />
      <Testimonials />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Home
