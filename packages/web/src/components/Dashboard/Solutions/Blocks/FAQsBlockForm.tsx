import React, { useState } from 'react'
import { BlockType } from '../BlockForm'

interface FAQ {
  question: string
  answer: string
}

interface FAQsBlockFormProps {
  block: Extract<BlockType, { type: 'FAQsBlock' }>
  handleBlockChange: (
    updatedBlock: Extract<BlockType, { type: 'FAQsBlock' }>
  ) => void
}

const FAQsBlockForm: React.FC<FAQsBlockFormProps> = ({
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
      type: 'FAQsBlock',
      props: { faqs: updatedFAQs }
    })
  }

  const handleAddFAQ = () => {
    const newFaq: FAQ = { question: '', answer: '' }
    const updatedFAQs = [...faqs, newFaq]
    setFaqs(updatedFAQs)
    handleBlockChange({
      _id: block._id,
      type: 'FAQsBlock',
      props: { faqs: updatedFAQs }
    })
  }

  const handleRemoveFAQ = (index: number) => {
    const updatedFAQs = faqs.filter((_, i) => i !== index)
    setFaqs(updatedFAQs)
    handleBlockChange({
      _id: block._id,
      type: 'FAQsBlock',
      props: { faqs: updatedFAQs }
    })
  }

  return (
    <div className="block-form rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">FAQs Block</h3>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item mb-4">
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
            placeholder="Question"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="answer"
            value={faq.answer}
            onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
            placeholder="Answer"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={() => handleRemoveFAQ(index)}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Remove FAQ
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddFAQ}
        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Add FAQ
      </button>
    </div>
  )
}

export default FAQsBlockForm
