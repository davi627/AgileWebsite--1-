import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'
import SidePadding from 'components/Shared/SidePadding.Component'

import feature4 from '../../assets/feature4.png'
import logo from '../../assets/Agile Logo.png'

function AgileBrief() {
  return (
    <SidePadding>
      <div className="shadow-top-bottom my-20 flex rounded-xl p-10">
        <div className="flex w-full flex-col items-start justify-evenly gap-4 md:w-1/2">
          <img src={logo} alt="Azure" className="h-10 w-auto" />

          <p className="text-xl tracking-wide md:text-3xl xl:text-4xl font-Poppins" >
            Optimize your Organization <br />
            With Cutting Edge<br/> 
            Management Information Systems <br />
            From Agile Business Solutions
          </p>
          <RequestDemoBtn />
        </div>
        <img
          src={feature4}
          alt="azure"
          className="hidden h-[28rem] w-1/2 rounded-xl object-cover object-center md:block"
        />
      </div>
    </SidePadding>
  )
}

export default AgileBrief
