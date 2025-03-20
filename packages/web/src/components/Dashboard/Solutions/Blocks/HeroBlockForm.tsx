import React, { useState } from 'react'
import { BlockType } from '../BlockForm'
import ImageUploader from '../../../ImageUploader'

interface HeroBlockFormProps {
  block: Extract<BlockType, { type: 'HeroBlock' }>
  handleBlockChange: (
    updatedBlock: Extract<BlockType, { type: 'HeroBlock' }>
  ) => void
}

const HeroBlockForm: React.FC<HeroBlockFormProps> = ({
  block,
  handleBlockChange
}) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    block.props.backgroundImageUrl
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleBlockChange({
      _id: block._id,
      type: 'HeroBlock',
      props: {
        ...block.props,
        [name]: value
      }
    })
  }

  const handleImageUploadSuccess = (url: string) => {
    setBackgroundImageUrl(url)
    handleBlockChange({
      _id: block._id,
      type: 'HeroBlock',
      props: {
        ...block.props,
        backgroundImageUrl: url
      }
    })
  }

  return (
    <div className="block-form rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">Hero Block</h3>
      <input
        type="text"
        name="title"
        value={block.props.title}
        onChange={handleChange}
        placeholder="Title"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
        required
      />
      <input
        type="text"
        name="subtitle"
        value={block.props.subtitle}
        onChange={handleChange}
        placeholder="Subtitle"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
        required
      />
      <div className="mb-3">
        <label className="mb-1 block text-sm font-semibold">
          Background Image
        </label>
        <ImageUploader
          onUploadSuccess={handleImageUploadSuccess}
          folder="hero-backgrounds"
          maxFileSizeMB={10}
          uploadPreset="your-upload-preset"
          cloudName="your-cloud-name"
        />
        {backgroundImageUrl && (
          <img
            src={backgroundImageUrl}
            alt="Background Preview"
            className="mt-2 max-h-40 w-full object-cover"
          />
        )}
      </div>
    </div>
  )
}

export default HeroBlockForm
