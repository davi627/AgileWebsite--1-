import React, { useState, useEffect } from 'react';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import { Link } from 'react-router-dom';

interface SolutionFeature {
  text: string;
}

interface Solution {
  id: number;
  name: string;
  shortDesc: string;
  fullDesc: string;
  features: SolutionFeature[];
  implementation: string;
}

interface SolutionCategory {
  title: string;
  solutions: Solution[];
}

const Soltns = () => {
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);
  const [solutionCategories, setSolutionCategories] = useState<SolutionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeColor = {
    primary: 'bg-[#167AA0]',
    primaryHover: 'hover:bg-[#12688a]',
    text: 'text-[#167AA0]',
    border: 'border-[#167AA0]',
    gradientFrom: 'from-[#167AA0]',
    gradientTo: 'to-[#12688a]'
  };

  useEffect(() => {
    const fetchSolutionCategories = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/solution-categories`);
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Server error: ${response.status} ${response.statusText}\n${errorData}`
          );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
        }

        const data = await response.json();
        setSolutionCategories(data);
        setError(null);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load solutions');
        setSolutionCategories([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutionCategories();
  }, []);

  const toggleSolution = (id: number) => {
    setExpandedSolution(expandedSolution === id ? null : id);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading solutions...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl">
          <h2 className="font-bold text-xl mb-2">Error Loading Solutions</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Please check your network connection and try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className={`relative bg-gradient-to-r ${themeColor.gradientFrom} ${themeColor.gradientTo} text-white py-24`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Comprehensive Solutions</h1>
            <p className="text-xl max-w-3xl mx-auto">
              End-to-end technology solutions transforming businesses across industries
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-16 container mx-auto px-4">
          {solutionCategories.map((category: SolutionCategory, index: number) => (
            <div key={index} className="mb-20">
              <div className="flex items-center mb-8">
                <div className={`h-1 w-12 ${themeColor.primary} mr-4`}></div>
                <h2 className={`text-3xl font-bold ${themeColor.text}`}>{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.solutions.map((solution: Solution) => (
                  <div key={solution.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className={`${themeColor.primary} p-5`}>
                      <h3 className="text-xl font-bold text-white">{solution.name}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 mb-4">{solution.shortDesc}</p>
                      
                      {expandedSolution === solution.id && (
                        <div className="mb-6 animate-fadeIn">
                          <p className="text-gray-700 mb-4">{solution.fullDesc}</p>
                          <h4 className={`font-semibold ${themeColor.text} mb-2`}>Key Features:</h4>
                          <ul className="space-y-2 mb-4">
                            {solution.features.map((feature: SolutionFeature, featIndex: number) => (
                              <li key={featIndex} className="flex items-start">
                                <svg className={`h-5 w-5 ${themeColor.text} mr-2 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">{feature.text}</span>
                              </li>
                            ))}
                          </ul>
                          <h4 className={`font-semibold ${themeColor.text} mb-2`}>Implementation:</h4>
                          <p className="text-gray-700">{solution.implementation}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => toggleSolution(solution.id)}
                        className={`w-full mt-4 ${themeColor.primary} ${themeColor.primaryHover} text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center`}
                      >
                        {expandedSolution === solution.id ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            View Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className={`${themeColor.primary} text-white py-16`}>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8">
                Our solution architects will design a customized technology roadmap for your organization
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to='/contact-us'>
                <button className="bg-white hover:bg-gray-100 text-[#167AA0] font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                  Request Demo
                </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Soltns;