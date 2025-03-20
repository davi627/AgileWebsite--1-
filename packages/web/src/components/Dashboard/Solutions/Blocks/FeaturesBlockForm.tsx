import React, { useState } from 'react'
import { BlockType } from '../BlockForm'

interface FAQ {
  question: string
  answer: string
}

interface FAQsBlockFormProps {
  block: Extract<BlockType, { type: 'FeaturesBlock' }>
  handleBlockChange: (
    updatedBlock: Extract<BlockType, { type: 'FeaturesBlock' }>
  ) => void
}

const FeaturesBlockForm: React.FC<FAQsBlockFormProps> = ({
  block,
  handleBlockChange
}) => {
  const [faqs, setFaqs] = useState<FAQ[]>(block.props.faqs)

  const handleFAQChange = (index: number, field: string, value: string) => {
    const updatedFAQs = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    )
    setFaqs(updatedFAQs)
    handleBlockChange({
      _id: block._id,
      type: 'FeaturesBlock',
      props: { faqs: updatedFAQs }
    })
  }

  const handleAddFAQ = () => {
    const newFaq: FAQ = { question: '', answer: '' }
    const updatedFAQs = [...faqs, newFaq]
    setFaqs(updatedFAQs)
    handleBlockChange({
      _id: block._id,
      type: 'FeaturesBlock',
      props: { faqs: updatedFAQs }
    })
  }

  const handleRemoveFAQ = (index: number) => {
    const updatedFAQs = faqs.filter((_, i) => i !== index)
    setFaqs(updatedFAQs)
    handleBlockChange({
      _id: block._id,
      type: 'FeaturesBlock',
      props: { faqs: updatedFAQs }
    })
  }

  return (
    <div className="block-form rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">Features Block</h3>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item mb-4">
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
            placeholder="Feature"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="answer"
            value={faq.answer}
            onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
            placeholder="Caption"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={() => handleRemoveFAQ(index)}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Remove Feature
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddFAQ}
        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Add Feature
      </button>
    </div>
  )
}

export default FeaturesBlockForm
