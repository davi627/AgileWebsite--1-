import { useNavigate } from 'react-router-dom'

import ArrowRight from '../../assets/arrow-right-blue.svg'

function ContactSales() {
  const navigate = useNavigate()

  return (
    <div className="bg-primary flex flex-col items-center px-4 py-16 text-white md:px-0">
      <p className="text-center text-3xl font-medium md:text-4xl">
        Ready to streamline your <br /> operations?
      </p>
      <p className="mb-12 mt-6 text-gray-300">
        Work more productively, boost efficiency, and improve business outcomes
        with tailored software and cloud solutions.
      </p>
      <button
        className="text-primary flex items-center gap-6 rounded-md bg-white px-7 py-3 md:text-lg"
        onClick={() => {
          navigate('/contact-us', { replace: false })
        }}
      >
        Contact Sales
        <img src={ArrowRight} alt="arrow" className="h-2" />
      </button>
    </div>
  )
}

export default ContactSales
