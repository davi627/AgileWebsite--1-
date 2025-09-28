import Navbar from '../Navbar'
import Footer from '../Footer'
import CareerHero from './CareerHero'
import JobListings from './JobListings'

export default function Careers() {
  return (
    <div className="bg-white">
      <Navbar />
      <main className="isolate">
        {/* Hero section */}
        <CareerHero />
        {/* Job listings section */}
        <JobListings />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}
