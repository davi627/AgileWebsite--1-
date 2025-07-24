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

export default function Landing() {
  return (
    <div className="font-poppins">
      <Navbar />
      <Hero />
      <Partners />
      <OurSolns />
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
