import { useNavigate } from 'react-router-dom'

import ArrowRight from '../../assets/arrow-right-blue.svg'

function ContactSales() {
  const navigate = useNavigate()

  return (
    <div className="bg-primary flex flex-col items-center px-4 py-12 sm:py-16 text-white md:px-0">
      <p className="text-center text-2xl sm:text-3xl md:text-4xl font-medium">
        Ready to streamline your <br /> operations?
      </p>
      <p className="mb-8 sm:mb-12 mt-4 sm:mt-6 text-gray-300 text-sm sm:text-base text-center">
        Work more productively, boost efficiency, and improve business outcomes
        with tailored software and cloud solutions.
      </p>
      <button
        className="text-primary flex items-center gap-4 sm:gap-6 rounded-md bg-white px-6 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg"
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
