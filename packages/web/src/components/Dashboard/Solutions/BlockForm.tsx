import React from 'react'
import {
  HeroBlockForm,
  ImageBlockForm,
  CallToActionBlockForm,
  FAQsBlockForm,
  ServicesBlockForm,
  FeaturesBlockForm
} from './Blocks'

export type BlockType =
  | {
      _id: string
      type: 'HeroBlock'
      props: { title: string; subtitle: string; backgroundImageUrl: string }
    }
  | {
      _id: string
      type: 'ImageBlock'
      props: {
        title: string
        subtitle: string
        imageUrl: string
        description: string
        imagePosition: 'left' | 'right'
      }
    }
  | {
      _id: string
      type: 'CallToActionBlock'
      props: {
        message: string
        buttonLabel: string
        buttonUrl: string
        learnMoreText: string
        learnMoreUrl: string
      }
    }
  | {
      _id: string
      type: 'FAQsBlock'
      props: { faqs: { question: string; answer: string }[] }
    }
  | {
      _id: string
      type: 'FeaturesBlock'
      props: { faqs: { question: string; answer: string }[] }
    }
  | {
      _id: string
      type: 'ServicesBlock'
      props: {
        services: {
          title: string
          description: string
          image: string
          url: string
          rank: number
        }[]
      }
    }

interface BlockFormProps {
  block: BlockType
  onChange: (updatedBlock: BlockType) => void
  onRemove: () => void
}

const BlockForm: React.FC<BlockFormProps> = ({ block, onChange }) => {
  const renderBlockForm = () => {
    switch (block.type) {
      case 'HeroBlock':
        return <HeroBlockForm block={block} handleBlockChange={onChange} />
      case 'ImageBlock':
        return <ImageBlockForm block={block} handleBlockChange={onChange} />
      case 'CallToActionBlock':
        return (
          <CallToActionBlockForm block={block} handleBlockChange={onChange} />
        )
      case 'FAQsBlock':
        return <FAQsBlockForm block={block} handleBlockChange={onChange} />
      case 'FeaturesBlock':
        return <FeaturesBlockForm block={block} handleBlockChange={onChange} />
      case 'ServicesBlock':
        return <ServicesBlockForm block={block} handleBlockChange={onChange} />
      default:
        return <p>Unknown block type</p>
    }
  }

  return (
    <div className="mb-4 rounded-lg bg-gray-100 p-6 shadow-sm">
      {renderBlockForm()}
    </div>
  )
}

export default BlockForm
