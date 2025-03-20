/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import HeroBlock from './HeroBlock'
import ContentBlock from './ContentBlock'
import ServicesBlock from './ServicesBlock'
import ImageGallery from './ImageGallery'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import FAQsBlock from './FAQsBlock'
import FeaturesBlock from './FeaturesBlock'
import VideoBlock from './VideoBlock'
import StatsBlock from './StatsBlock'
import QuoteBlock from './QuoteBlock'
import CallToActionBlock from './CallToActionBlock'
import ImageBlock from './ImageBlock'
import CtaButtonBlock from './CtaButtonBlock'

const componentMap: { [key: string]: React.FC<any> } = {
  HeroBlock,
  ContentBlock,
  ImageGallery,
  ServicesBlock,
  FAQsBlock,
  FeaturesBlock,
  VideoBlock,
  StatsBlock,
  QuoteBlock,
  CallToActionBlock,
  ImageBlock,
  CtaButtonBlock
}

interface Block {
  type: string
  props: any
}

interface PageTemplateProps {
  blocks: Block[]
}

const PageTemplate: React.FC<PageTemplateProps> = ({ blocks }) => {
  return (
    <div>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {blocks.map((block, index) => {
          const Component = componentMap[block.type]
          if (!Component) {
            console.error(`Component not found for type: ${block.type}`)
            return null
          }
          return <Component key={index} {...block.props} />
        })}
      </main>
      <Footer />
    </div>
  )
}

export default PageTemplate
