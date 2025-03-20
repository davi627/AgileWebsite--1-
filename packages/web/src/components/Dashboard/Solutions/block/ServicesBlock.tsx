/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

interface Service {
  title: string
  description: string
  image: string
  url: string
  rank: number
}

interface ServicesBlockFormProps {
  block: any
  handleBlockChange: (updatedBlock: any) => void
}

const ServicesBlockForm: React.FC<ServicesBlockFormProps> = ({
  block,
  handleBlockChange
}) => {
  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string | number
  ) => {
    const updatedServices = block.props.services.map(
      (service: Service, i: number) =>
        i === index ? { ...service, [field]: value } : service
    )
    handleBlockChange({
      ...block,
      props: { ...block.props, services: updatedServices }
    })
  }

  const addService = () => {
    const newService: Service = {
      title: '',
      description: '',
      image: '',
      url: '',
      rank: block.props.services.length + 1
    }
    handleBlockChange({
      ...block,
      props: { ...block.props, services: [...block.props.services, newService] }
    })
  }

  const removeService = (index: number) => {
    const updatedServices = block.props.services.filter(
      (_: Service, i: number) => i !== index
    )
    handleBlockChange({
      ...block,
      props: { ...block.props, services: updatedServices }
    })
  }

  return (
    <div className="block-form rounded-md bg-gray-50 p-4 shadow">
      <h3 className="text-md mb-2 font-semibold">Services Block</h3>

      {block.props.services.map((service: Service, index: number) => (
        <div key={index} className="mb-4 rounded-lg border p-4">
          <h4 className="text-md mb-2 font-semibold">Service #{index + 1}</h4>
          <input
            type="text"
            name="title"
            value={service.title}
            onChange={(e) =>
              handleServiceChange(index, 'title', e.target.value)
            }
            placeholder="Service Title"
            className="mb-2 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="url"
            value={service.url}
            onChange={(e) => handleServiceChange(index, 'url', e.target.value)}
            placeholder="Service URL"
            className="mb-2 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="image"
            value={service.image}
            onChange={(e) =>
              handleServiceChange(index, 'image', e.target.value)
            }
            placeholder="Image URL"
            className="mb-2 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <textarea
            name="description"
            value={service.description}
            onChange={(e) =>
              handleServiceChange(index, 'description', e.target.value)
            }
            placeholder="Service Description"
            className="mb-2 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
          <input
            type="number"
            name="rank"
            value={service.rank}
            onChange={(e) =>
              handleServiceChange(index, 'rank', Number(e.target.value))
            }
            placeholder="Rank"
            className="mb-2 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={() => removeService(index)}
            className="mt-2 block w-full rounded-md bg-red-600 px-4 py-2 text-white shadow-sm"
          >
            Remove Service
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addService}
        className="bg-primary mt-4 block w-full rounded-md px-4 py-2 text-white shadow-sm"
      >
        Add Service
      </button>
    </div>
  )
}

export default ServicesBlockForm
