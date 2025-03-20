import Navbar from '../Navbar'
import Footer from '../Footer'
import CareerHero from './CareerHero'
import CareerContent from './CareerContent'
import JobOpenings from './JobOpenings'

export default function Careers() {
  return (
    <div className="bg-white">
      <Navbar />
      <main className="isolate">
        {/* Hero section */}
        <CareerHero />
        {/* Timeline section */}

        {/* Content section */}
        <CareerContent />
      </main>
      <JobOpenings />
      {/* Footer */}
      <Footer />
    </div>
  )
}
