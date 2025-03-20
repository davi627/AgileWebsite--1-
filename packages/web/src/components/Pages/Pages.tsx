import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import NotFound from '../NotFound'
import { usePageData } from '../../hooks/usePageData'
import Content from './Content'
import BlogContent from './BlogContent'
import Navbar from '../Navbar'
import Footer from '../Footer'

function Pages() {
  const { slug } = useParams<{ slug: string }>()
  const pathSegments = window.location.pathname.split('/')
  const pageType = pathSegments[1]

  const { pageData, loading, error } = usePageData(pageType, slug || '')

  if (loading) return
  if (error) return <NotFound />
  if (!pageData) return <NotFound />

  return (
    <div className="bg-white">
      <Navbar />
      <div className="">
        <Helmet>
          <title>{pageData.title}</title>
          <meta name="description" content={pageData.description} />
        </Helmet>

        <div className="mx-auto max-w-2xl py-8 sm:py-16 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {pageData.type === 'pages' && <Content {...pageData} />}
              {pageData.type === 'blog' && <BlogContent {...pageData} />}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
              fugiat aliqua.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="bg-primary focus-visible:outline-primary rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Get started
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Pages
