import React from 'react'
import { BlockType } from '../BlockForm'

interface CallToActionBlockFormProps {
  block: Extract<BlockType, { type: 'CallToActionBlock' }>
  handleBlockChange: (
    updatedBlock: Extract<BlockType, { type: 'CallToActionBlock' }>
  ) => void
}

const CallToActionBlockForm: React.FC<CallToActionBlockFormProps> = ({
  block,
  handleBlockChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleBlockChange({
      _id: block._id,
      type: 'CallToActionBlock',
      props: { ...block.props, [name]: value }
    })
  }

  return (
    <div className="block-form rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">Call To Action Block</h3>
      <input
        type="text"
        name="message"
        value={block.props.message}
        onChange={handleChange}
        placeholder="Message"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
      />
      <input
        type="text"
        name="buttonLabel"
        value={block.props.buttonLabel}
        onChange={handleChange}
        placeholder="Button Label"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
      />
      <input
        type="text"
        name="buttonUrl"
        value={block.props.buttonUrl}
        onChange={handleChange}
        placeholder="Button URL"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
      />
      {/* <input
        type="text"
        name="learnMoreText"
        value={block.props.learnMoreText}
        onChange={handleChange}
        placeholder="Learn More Text"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
      />
      <input
        type="text"
        name="learnMoreUrl"
        value={block.props.learnMoreUrl}
        onChange={handleChange}
        placeholder="Learn More URL"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
      /> */}
    </div>
  )
}

export default CallToActionBlockForm
