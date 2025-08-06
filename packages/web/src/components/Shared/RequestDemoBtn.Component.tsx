import { useNavigate } from 'react-router-dom'
import ArrowRight from '../../assets/arrow-right.png'

function RequestDemoBtn() {
  const navigate = useNavigate()

  return (
    <button
      type='button'
      className="bg-alternate hover:bg-cyan-700 flex items-center gap-2 rounded-3xl p-2.5 sm:p-3 text-sm sm:text-base text-white transition duration-300 hover:scale-105 md:px-6 md:py-3 md:text-lg"
      onClick={() => {
        navigate('/contact-us', { replace: false })
      }}
    >
      Request Demo

    </button>
  )
}

export default RequestDemoBtn
