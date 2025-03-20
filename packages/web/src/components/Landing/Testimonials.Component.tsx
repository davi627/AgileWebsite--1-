import SidePadding from 'components/Shared/SidePadding.Component'

import testimonial1 from '../../assets/testimonial1.png'
import ArrowRight from '../../assets/arrow-right.png'
import minet from '../../assets/logos/minet.png'
import Excel from '../../assets/logos/ms_excel.png'
import Outlook from '../../assets/logos/ms_outlook.png'
import Sharepoint from '../../assets/logos/ms_sharepoint.png'

function Testimonials() {
  return (
    <SidePadding>
      <div className="py-20">
        <p className="text-3xl font-medium leading-9 md:text-4xl">
          See how organizations grow with <br />
          Our Microsoft solutions
        </p>
        <div className="shadow-top-bottom mt-14 flex gap-5 rounded-xl p-6 md:p-10">
          <div className="flex w-full flex-col items-start justify-evenly gap-6 md:w-1/2">
            <img src={minet} alt="logo" className="h-10 w-auto" />
            <div className="">
              <p>
                “Using AgilePen has streamlined our financial operations
                significantly through automated workflows, real-time insights
                and robust reporting capabilities. We have reduced manual tasks
                by 70% and greatly improved our accuracy.”
              </p>
              <p className="mt-4 text-sm italic text-gray-600">
                -Mwenje Okwemba, CFO-Minet Insurance Company
              </p>
            </div>

            <div>
              <p className="font-medium">Products</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm font-light">
                <div className="flex items-center gap-2">
                  <img src={Excel} alt="" className="size-6" />
                  <p>Microsoft 365</p>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Outlook} alt="" className="size-6" />
                  <p>Dynamics NAV</p>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Sharepoint} alt="" className="size-6" />
                  <p>Sharepoint</p>
                </div>
              </div>
            </div>

            <button className="bg-primary flex items-center gap-2 rounded-md px-7 py-3 text-lg text-white">
              Read More
              <img src={ArrowRight} alt="arrow" className="h-2" />
            </button>
          </div>
          <img
            src={testimonial1}
            alt="azure"
            className="hidden h-[28rem] w-1/2 rounded-xl object-cover object-center md:block"
          />
        </div>
      </div>
    </SidePadding>
  )
}

export default Testimonials
