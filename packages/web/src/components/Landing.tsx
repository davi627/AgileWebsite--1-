import Blog from './Blog'
import Footer from './Footer'
import Hero from './Hero'
import OurSolns from './OurSolns/OurSolns.Component'
import Navbar from './Navbar'
import Partners from './Partners'
// import Testimonials from './Testimonials'
import Stats from './Stats'
// import Solutions from './Solutions'
// import Solutions from './CoreSolutions'
import ProductsSection from './CoreProducts'
import ContactSales from './Landing/ContactSales.Component'
import Testimonials from './Landing/Testimonials.Component'
import AgileBrief from './OurSolns/AgileBrief.Component'

import VoiceflowWidget from './Shared/VoiceflowWidget.Component'
import TalkPage from './TalkPage/TalkPage'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Landing() {
  const location = useLocation()
  const navigate = useNavigate()
  const ourSolnsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (location.state?.scrollToSection === 'erp-solutions' && ourSolnsRef.current) {
      console.log('Scrolling to OurSolns section')
      setTimeout(() => {
        ourSolnsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
        // Clear the state after scrolling to prevent unwanted scrolling on page reload
        navigate(location.pathname, { replace: true, state: {} })
      }, 300)
    }
  }, [location.state, navigate, location.pathname])

  return (
    <div className="font-poppins">
      <Navbar />
      <Hero />
      <Partners />
      <div ref={ourSolnsRef}>
        <OurSolns />
      </div>
      <Stats />
      <ProductsSection />
      <Testimonials />
      <TalkPage />
      {/* <Testimonials /> */}
      <Blog />
      <Footer />
      <VoiceflowWidget />
    </div>
  )
}
