import React from 'react'
import ContactDetails from './ContactDetails'
import Locations from './LocationDetails'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
// import OperatingHours from './OperatingHours'
import ContactForm from './ContactForm'

const ContactUsPage: React.FC = () => {
  return (
    <>
      <div className="py-24 sm:py-32">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
            <ContactDetails />
            <Locations />
            {/* <OperatingHours /> */}
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ContactUsPage
