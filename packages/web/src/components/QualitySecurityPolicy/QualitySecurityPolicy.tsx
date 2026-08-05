import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'

const bodyClass =
  'text-[20px] font-normal text-black mb-6'
const bodyStyle = { fontFamily: 'Poppins' } as const
const sectionTitleClass =
  'text-[32px] font-semibold text-black mb-6'
const sectionTitleStyle = { fontFamily: 'Poppins' } as const

const QualitySecurityPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-16">
        <h1
          className="text-[48px] font-semibold leading-[58px] capitalize mb-12"
          style={{ color: '#202020', fontFamily: 'Poppins' }}
        >
          Agile's Quality and Information Security Policy
        </h1>

        <div className="max-w-none">
          <section className="mb-12">
            <p className={bodyClass} style={bodyStyle}>
              At Agile, we are committed to providing seamless IT solutions that
              empower our clients. This dedication is enshrined in our Quality
              and Information Security Policy, the foundation of our Integrated
              Management System (IMS).
            </p>
          </section>

          <section className="mb-12">
            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
              1. Setting the Compass for Success
            </h2>
            <p className={bodyClass} style={bodyStyle}>
              Our Policy champions our strategic direction, prioritizing
              technical competence and the creation of lasting value for our
              clients. By aligning our every action with this guiding principle,
              we ensure that excellence is the roadmap for every project we
              undertake.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
              2. Building a Framework for Excellence
            </h2>
            <p className={bodyClass} style={bodyStyle}>
              This Policy serves as the cornerstone for setting SMART (Specific,
              Measurable, Achievable, Relevant, and Time-bound) quality and
              information security objectives across all facets of our operation.
              Every team is empowered to strive for continuous improvement within
              their domain.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
              3. Commitment to Compliance
            </h2>
            <p className={bodyClass} style={bodyStyle}>
              We recognize that exceptional service thrives on a foundation of
              compliance. We commit to fulfilling all applicable requirements, be
              it government regulations, client-specific cybersecurity protocols,
              or international quality and information security standards. We
              operate with integrity and transparency, ensuring every aspect of
              our service delivery adheres to the highest ethical and legal
              benchmarks.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
              4. A Persistent Drive for Improvement
            </h2>
            <p className={bodyClass} style={bodyStyle}>
              At Agile, we champion a commitment to continuous improvement. We
              actively seek out opportunities to enhance our IMS, refine
              processes, and optimize methodologies. We embrace ongoing learning
              and adaptation, in order to remain at the forefront of the dynamic
              IT landscape.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
              5. Information Security Commitment
            </h2>
            <p className={bodyClass} style={bodyStyle}>
              We establish an information security policy that is appropriate to
              the purpose of the organization, includes information security
              objectives, satisfies applicable requirements related to
              information security, and includes a commitment to continual
              improvement of the information security management system. This
              policy is available as documented information, communicated within
              the organization, and available to interested parties, as
              appropriate.
            </p>
          </section>

          <section className="mb-12">
            <p className={bodyClass} style={bodyStyle}>
              This Quality and Information Security Policy instils in our teams a
              spirit of dedication and inspires innovation. Through it, we also
              forge partnerships built on trust, mutual respect, and a shared
              vision for a digitally empowered future.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default QualitySecurityPolicy
