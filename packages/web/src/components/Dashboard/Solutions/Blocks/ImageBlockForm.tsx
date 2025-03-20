import React, { useState } from 'react'
import { BlockType } from '../BlockForm'
import ImageUploader from '../../../ImageUploader'

interface ImageBlockFormProps {
  block: Extract<BlockType, { type: 'ImageBlock' }>
  handleBlockChange: (
    updatedBlock: Extract<BlockType, { type: 'ImageBlock' }>
  ) => void
}

const ImageBlockForm: React.FC<ImageBlockFormProps> = ({
  block,
  handleBlockChange
}) => {
  const [imageUrl, setImageUrl] = useState(block.props.imageUrl)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    handleBlockChange({
      _id: block._id,
      type: 'ImageBlock',
      props: { ...block.props, [name]: value }
    })
  }

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url)
    handleBlockChange({
      _id: block._id,
      type: 'ImageBlock',
      props: {
        ...block.props,
        imageUrl: url
      }
    })
  }

  return (
    <div className="block-form rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">Image Block</h3>
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
      <input
        type="text"
        name="description"
        value={block.props.description}
        onChange={handleChange}
        placeholder="Description"
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
        required
      />
      <div className="mb-3">
        <label className="mb-1 block text-sm font-semibold">Image</label>
        <ImageUploader
          onUploadSuccess={handleImageUploadSuccess}
          folder="image-blocks"
          maxFileSizeMB={10}
          uploadPreset="your-upload-preset"
          cloudName="your-cloud-name"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Image Preview"
            className="mt-2 max-h-40 w-full object-cover"
          />
        )}
      </div>
      <select
        name="imagePosition"
        value={block.props.imagePosition}
        onChange={handleChange}
        className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
      >
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    </div>
  )
}

export default ImageBlockForm
