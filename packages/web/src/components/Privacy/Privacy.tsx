import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-16">
        <h1
          className="text-[48px] font-semibold leading-[58px] capitalize mb-12"
          style={{ color: '#202020', fontFamily: 'Poppins' }}
        >
          Privacy Policy
        </h1>

        <div className="max-w-none">
          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              1. Introduction
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              At Agile Business Solutions Limited, we are committed to
              protecting the privacy and confidentiality of our customers' and
              users' personal information. This Privacy Policy outlines how we
              collect, use, disclose, and protect the information we gather from
              individuals who use our website, products, or services. By using
              our services or providing us with your personal information, you
              consent to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              2. Information We Collect
            </h2>
            <div className="mb-6">
              <h3
                className="text-[20px] font-semibold text-black mb-4"
                style={{ fontFamily: 'Poppins' }}
              >
                Personal Information:
              </h3>
              <p
                className="text-[20px] font-normal text-black mb-6"
                style={{ fontFamily: 'Poppins' }}
              >
                We may collect personal information such as your name, email
                address, phone number, and other relevant contact details when
                you voluntarily provide them to us.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-[20px] font-semibold text-black mb-4"
                style={{ fontFamily: 'Poppins' }}
              >
                Usage Information:
              </h3>
              <p
                className="text-[20px] font-normal text-black mb-6"
                style={{ fontFamily: 'Poppins' }}
              >
                We may collect non-personal information about your interactions
                with our website, such as your IP address, browser type,
                operating system, referring URLs, and pages visited, to improve
                our services and user experience.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-[20px] font-semibold text-black mb-4"
                style={{ fontFamily: 'Poppins' }}
              >
                Cookies and Tracking Technologies:
              </h3>
              <p
                className="text-[20px] font-normal text-black mb-6"
                style={{ fontFamily: 'Poppins' }}
              >
                We may use cookies and similar tracking technologies to collect
                information about your browsing activities on our website. You
                can control cookies through your browser settings.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              3. Use of Information
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We use the information we collect to provide and improve our
              products and services, respond to your inquiries, personalize your
              experience, and communicate with you about our offerings.
            </p>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We may aggregate and anonymize data for statistical and analytical
              purposes, but this information will not identify you personally.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              4. Information Sharing
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We do not sell, rent, or lease your personal information to third
              parties for their marketing purposes.
            </p>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We may share your information with trusted service providers who
              assist us in operating our business and serving our customers.
              These service providers are contractually bound to protect your
              information and use it only for the purposes specified by us.
            </p>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We may disclose your information if required by law or in good
              faith belief that such action is necessary to comply with legal
              obligations, protect our rights, or investigate suspected
              violations.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              5. Data Security
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We employ industry-standard security measures to protect the
              information we collect and prevent unauthorized access, use, or
              disclosure.
            </p>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              However, no method of transmission over the internet or electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your personal information, we cannot
              guarantee its absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              6. Links to Third-Party Websites
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              Our website may contain links to third-party websites. Please note
              that we are not responsible for the privacy practices or content
              of these sites. We encourage you to review the privacy policies of
              any third-party websites you visit.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              7. Your Privacy Choices
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              You can opt out of receiving promotional emails from us by
              following the unsubscribe instructions provided in those emails.
            </p>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              You may also contact us to request access, correction, or deletion
              of your personal information, subject to applicable legal
              requirements.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              8. Updates to this Privacy Policy
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              We may update this Privacy Policy from time to time to reflect
              changes in our information practices. We encourage you to review
              this Policy whenever you interact with us to stay informed about
              our data handling practices.
            </p>
          </section>

          <section className="mb-12">
            <h2
              className="text-[32px] font-semibold text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              9. Contact Information
            </h2>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              If you have any questions or concerns about our Privacy Policy or
              the handling of your personal information, please contact us at:{' '}
              <a
                href="mailto:privacy@agilebs.com"
                className="text-blue-600 hover:underline"
              >
                privacy@agilebiz.co.ke
              </a>
            </p>
            <p
              className="text-[20px] font-normal text-black mb-6"
              style={{ fontFamily: 'Poppins' }}
            >
              By using our website or providing your personal information, you
              acknowledge that you have read and understood this Privacy Policy
              and agree to its terms and conditions.
            </p>
            <p
              className="text-[20px] font-normal text-black"
              style={{ fontFamily: 'Poppins' }}
            >
              Effective Date: 8th June 2023
            </p>
          </section>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default Privacy
