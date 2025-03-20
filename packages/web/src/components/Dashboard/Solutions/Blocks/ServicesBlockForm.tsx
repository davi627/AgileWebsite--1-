import React, { useState } from 'react'
import { BlockType } from '../BlockForm'
import ImageUploader from '../../../ImageUploader'

interface ServicesBlockFormProps {
  block: Extract<BlockType, { type: 'ServicesBlock' }>
  handleBlockChange: (
    updatedBlock: Extract<BlockType, { type: 'ServicesBlock' }>
  ) => void
}

const ServicesBlockForm: React.FC<ServicesBlockFormProps> = ({
  block,
  handleBlockChange
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(
    block.props.services.map((service) => service.image)
  )

  const handleServiceChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedServices = block.props.services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    )
    handleBlockChange({
      _id: block._id,
      type: 'ServicesBlock',
      props: { services: updatedServices }
    })
  }

  const handleImageUploadSuccess = (index: number, url: string) => {
    const updatedServices = block.props.services.map((service, i) =>
      i === index ? { ...service, image: url } : service
    )
    setImageUrls((prevUrls) =>
      prevUrls.map((prevUrl, i) => (i === index ? url : prevUrl))
    )
    handleBlockChange({
      _id: block._id,
      type: 'ServicesBlock',
      props: { services: updatedServices }
    })
  }

  return (
    <div className="block-form rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">Services Block</h3>
      {block.props.services.map((service, index) => (
        <div key={index} className="service-item mb-4">
          <input
            type="text"
            name="title"
            value={service.title}
            onChange={(e) =>
              handleServiceChange(index, 'title', e.target.value)
            }
            placeholder="Service Title"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="description"
            value={service.description}
            onChange={(e) =>
              handleServiceChange(index, 'description', e.target.value)
            }
            placeholder="Service Description"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <div className="mb-3">
            <label className="mb-1 block text-sm font-semibold">Image</label>
            <ImageUploader
              onUploadSuccess={(url) => handleImageUploadSuccess(index, url)}
              folder="service-images"
              maxFileSizeMB={10}
              uploadPreset="your-upload-preset"
              cloudName="your-cloud-name"
            />
            {imageUrls[index] && (
              <img
                src={imageUrls[index]}
                alt="Service Image Preview"
                className="mt-2 max-h-40 w-full object-cover"
              />
            )}
          </div>
          <input
            type="text"
            name="url"
            value={service.url}
            onChange={(e) => handleServiceChange(index, 'url', e.target.value)}
            placeholder="Service URL"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="number"
            name="rank"
            value={service.rank}
            onChange={(e) =>
              handleServiceChange(index, 'rank', Number(e.target.value))
            }
            placeholder="Service Rank"
            className="mb-3 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}

export default ServicesBlockForm
