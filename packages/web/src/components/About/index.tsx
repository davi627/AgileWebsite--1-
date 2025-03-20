import React from 'react'
import HeroSection from './AboutUsHero'
import ContentSection from './AboutUsContent'
import ValuesSection from './AboutUsValues'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import TeamSection from './AboutUsTeam'

const AboutUsPage: React.FC = () => {
  return (
    <div className="">
      <Navbar />
      <main className="isolate">
        <HeroSection />
        <ContentSection />
        <ValuesSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  )
}

export default AboutUsPage
