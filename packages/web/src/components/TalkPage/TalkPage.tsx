
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidePadding from 'components/Shared/SidePadding.Component';

interface TalkPageProps {}

const TalkPage: React.FC<TalkPageProps> = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const navigate = useNavigate();

  const services = [
    'Software Development',
    'ERP Solution',
    'Pension Solution',
    'Bespoke Solution',
    'Infrastructure Services',
    'Change Management'
  ];

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = () => {
    navigate('/contact-us', { state: { selectedServices } });
  };

  return (
    <SidePadding>
      <div className="py-8 sm:py-16 flex items-center justify-center 4xl:ml-[40px] ">
        <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row min-h-[340px]">
          {/* Left Panel */}
          <div className="bg-primary text-white p-6 sm:p-12 flex-1 flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center">
              Hello<br />
              Let's Talk
            </h1>
          </div>

          {/* Right Panel */}
          <div className="p-6 sm:p-12 flex-1 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-lg sm:text-xl text-gray-600 mb-8 text-center font-medium">
                How can we help you?
              </h2>

              {/* Service Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {services.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-4 py-3 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] flex items-center justify-center ${
                      selectedServices.includes(service)
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-white border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center mx-auto font-medium"
                >
                  Submit
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidePadding>
  );
};

export default TalkPage;
