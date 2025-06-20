import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidePadding from 'components/Shared/SidePadding.Component';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000';

interface ISolution {
  id: number;
  name: string;
  shortDesc?: string;
  fullDesc: string;
  features: { text: string }[];
  implementation?: string;
}

interface ISolutionCategory {
  _id: string;
  title: string;
  imageUrl?: string;
  solutions?: ISolution[];
}

const FormattedText: React.FC<{ html: string, className?: string }> = ({ html, className = '' }) => {
  const formatHtml = (content: string) => {
    if (!content) return '';

    let formatted = content;

    if (!formatted.includes('<') && !formatted.includes('>')) {
      const paragraphs = formatted.split(/\n\s*\n/);
      formatted = paragraphs
        .filter(p => p.trim())
        .map(p => `<p class="mb-4">${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('');
    } else {
      formatted = formatted.replace(/<p(?![^>]*class)/g, '<p class="mb-4"');
      formatted = formatted.replace(/<p class="([^"]*)">/g, (match, classes) => {
        if (!classes.includes('mb-')) {
          return `<p class="${classes} mb-4">`;
        }
        return match;
      });
      formatted = formatted.replace(/\n/g, '<br>');
      formatted = formatted.replace(/<div(?![^>]*class)/g, '<div class="mb-4"');
      formatted = formatted.replace(/<h([1-6])(?![^>]*class)/g, '<h$1 class="font-semibold mb-3 mt-6"');
      formatted = formatted.replace(/<ul(?![^>]*class)/g, '<ul class="list-disc mb-4 ml-6 space-y-2"');
      formatted = formatted.replace(/<ol(?![^>]*class)/g, '<ol class="list-decimal mb-4 ml-6 space-y-2"');
      formatted = formatted.replace(/<li(?![^>]*class)/g, '<li class="mb-2 leading-relaxed"');
      formatted = formatted.replace(/<strong(?![^>]*class)/g, '<strong class="font-bold"');
      formatted = formatted.replace(/<b(?![^>]*class)/g, '<b class="font-bold"');
      formatted = formatted.replace(/<em(?![^>]*class)/g, '<em class="italic"');
      formatted = formatted.replace(/<i(?![^>]*class)/g, '<i class="italic"');
    }

    formatted = formatted
      .replace(/<p[^>]*><\/p>/g, '')
      .replace(/<div[^>]*><\/div>/g, '')
      .replace(/<p[^>]*>\s*<\/p>/g, '')
      .replace(/<div[^>]*>\s*<\/div>/g, '');

    return formatted;
  };

  return (
    <div
      className={`prose prose-lg max-w-none text-gray-700 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: formatHtml(html) }}
      style={{
        wordBreak: 'break-word',
        lineHeight: '1.7'
      }}
    />
  );
};

const TextContent: React.FC<{ content: string, className?: string }> = ({ content, className = '' }) => {
  if (!content) return null;

  const hasHtml = content.includes('<') && content.includes('>');

  if (hasHtml) {
    return <FormattedText html={content} className={className} />;
  }

  const formatPlainText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let inOrderedList = false;
    let inUnorderedList = false;
    let listItems: React.ReactNode[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        if (inOrderedList) {
          elements.push(
            <ol key={elements.length} className="list-decimal mb-4 ml-6 space-y-2">
              {listItems}
            </ol>
          );
        } else if (inUnorderedList) {
          elements.push(
            <ul key={elements.length} className="list-disc mb-4 ml-6 space-y-2">
              {listItems}
            </ul>
          );
        }
        listItems = [];
        inOrderedList = false;
        inUnorderedList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '') {
        if (inOrderedList || inUnorderedList) {
          continue;
        } else if (currentParagraph.length > 0) {
          flushParagraph();
        }
        continue;
      }

      const numberedMatch = line.match(/^(\d+)\.\s*(.+)$/);
      if (numberedMatch) {
        flushParagraph();
        if (!inOrderedList) {
          flushList();
          inOrderedList = true;
        }
        const [, , itemText] = numberedMatch;
        listItems.push(
          <li key={listItems.length} className="mb-2 leading-relaxed">
            {itemText}
          </li>
        );
        continue;
      }

      const bulletMatch = line.match(/^[•\-*]\s*(.+)$/);
      if (bulletMatch) {
        flushParagraph();
        if (!inUnorderedList) {
          flushList();
          inUnorderedList = true;
        }
        const [, itemText] = bulletMatch;
        listItems.push(
          <li key={listItems.length} className="mb-2 leading-relaxed">
            {itemText}
          </li>
        );
        continue;
      }

      if (inOrderedList || inUnorderedList) {
        if (line.startsWith('   ') || line.startsWith('\t')) {
          if (listItems.length > 0) {
            const lastItem = listItems[listItems.length - 1];
            listItems[listItems.length - 1] = React.cloneElement(
              lastItem as React.ReactElement,
              {},
              `${(lastItem as React.ReactElement).props.children} ${line.trim()}`
            );
          }
          continue;
        } else {
          flushList();
        }
      }

      currentParagraph.push(line);
    }

    flushParagraph();
    flushList();

    return elements;
  };

  return (
    <div className={`text-gray-700 ${className}`}>
      {formatPlainText(content)}
    </div>
  );
};

function SolutionsDetails() {
  const { categoryId, solutionId } = useParams<{
    categoryId: string;
    solutionId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ISolutionCategory | null>(null);
  const [solution, setSolution] = useState<ISolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutionDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const [solutionRes, categoryRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/solutions/${solutionId}`),
            axios.get(`${API_BASE_URL}/api/solution-categories/${categoryId}`)
          ]);
          setSolution(solutionRes.data);
          setCategory(categoryRes.data);
          setLoading(false);
          return;
        } catch (e) {
          console.log('Falling back to full categories fetch');
        }

        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
        const categories = Array.isArray(response.data) ? response.data : response.data?.data || [];

        const foundCategory = categories.find((cat: ISolutionCategory) => cat._id === categoryId);
        if (!foundCategory) throw new Error('Category not found');

        const solutionIdNum = parseInt(solutionId || '0');
        const foundSolution = foundCategory.solutions?.find((sol: ISolution) => sol.id === solutionIdNum);
        if (!foundSolution) throw new Error('Solution not found in category');

        setCategory(foundCategory);
        setSolution(foundSolution);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutionDetails();
  }, [categoryId, solutionId, navigate]);

  const handleGoBack = () => navigate('/solns');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#167AA1] mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading solution details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <SidePadding>
            <div className="py-14">
              <button
                onClick={handleGoBack}
                className="mb-6 flex items-center text-[#34C4EC] hover:underline transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Solutions
              </button>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </SidePadding>
        </main>
        <Footer />
      </div>
    );
  }

  if (!solution || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Solution not found</p>
            <button
              onClick={handleGoBack}
              className="mt-4 text-[#34C4EC] hover:underline"
            >
              Back to Solutions
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <SidePadding>
          <div className="py-14">
            <button
              onClick={handleGoBack}
              className="mb-6 flex items-center text-[#34C4EC] hover:underline transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Solutions
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-[#167AA1] text-white p-6">
                <h1 className="text-3xl font-bold mb-2">{solution.name}</h1>
                <p className="text-blue-100 text-lg">{category.title}</p>
              </div>

              <div className="p-8">
                {solution.shortDesc && (
                  <div className="mb-10">
                    <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#167AA1]">
                      <TextContent content={solution.shortDesc} className="text-lg text-gray-800 font-medium" />
                    </div>
                  </div>
                )}

                <div className="mb-10">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">
                    Overview
                  </h2>
                  <div className="bg-white">
                    <TextContent content={solution.fullDesc} />
                  </div>
                </div>

                {solution.features?.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-primary pb-2">
                      Key Features
                    </h2>
                    <div className="space-y-6">
                      {solution.features.map((feature, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#167AA1]">
                          <TextContent content={feature.text} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {solution.implementation && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-primary pb-2">
                      Implementation
                    </h2>
                    <div className="bg-white 50 rounded-lg p-6 border-l-4 border-[#167AA1]">
                      <TextContent content={solution.implementation} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidePadding>
      </main>
      <Footer />
    </div>
  );
}

export default SolutionsDetails;
