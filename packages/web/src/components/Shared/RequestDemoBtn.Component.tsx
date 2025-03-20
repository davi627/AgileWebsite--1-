import { useNavigate } from 'react-router-dom'

import ArrowRight from '../../assets/arrow-right.png'

function RequestDemoBtn() {
  const navigate = useNavigate()

  return (
    <button
      className="bg-primary hover:bg-alternate flex items-center gap-2 rounded-md p-3 text-base text-white transition duration-300 hover:scale-105 md:px-7 md:text-lg"
      onClick={() => {
        navigate('/contact-us', { replace: false })
      }}
    >
      Request Demo
      <img src={ArrowRight} alt="arrow" className="h-2" />
    </button>
  )
}

export default RequestDemoBtn
