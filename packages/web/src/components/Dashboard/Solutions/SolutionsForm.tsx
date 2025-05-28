// @ts-nocheck

import React, { useState, useEffect, FormEvent } from 'react'
import BlockForm from './BlockForm'
import { v4 as uuidv4 } from 'uuid'
import { BlockType } from './BlockForm'
import {
  fetchSolutions,
  updateSolution,
  createSolution
} from '../../../services/SolutionsService'
import ImageUploader from '../../../components/ImageUploader'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon
} from '@heroicons/react/24/solid'

// Define the Solution type
interface Solution {
  _id?: string
  name: string
  description: string
  icon: string
  blocks: BlockType[]
  children?: string[]
  isPrimary: boolean
  rank: number
}

// Define the options for the block types
const blockOptions = [
  { value: 'HeroBlock', label: 'Hero Block' },
  { value: 'ImageBlock', label: 'Image Block' },
  { value: 'CallToActionBlock', label: 'Call to Action Block' },
  { value: 'FAQsBlock', label: 'FAQs Block' },
  { value: 'ServicesBlock', label: 'Services Block' },
  { value: 'FeaturesBlock', label: 'Features Block' }
] as const

type BlockOptionType = (typeof blockOptions)[number]['value']

// Define the props for the SolutionForm component
interface SolutionFormProps {
  solution?: Solution | null
  onSave: (solution: Solution) => Promise<void>
  onCancel: () => void
}

// Function to create a new block based on the block type
const createNewBlock = (type: BlockOptionType): BlockType => {
  const id = uuidv4()
  switch (type) {
    case 'HeroBlock':
      return {
        _id: id,
        type,
        props: { title: '', subtitle: '', backgroundImageUrl: '' }
      }
    case 'ImageBlock':
      return {
        _id: id,
        type,
        props: {
          title: '',
          subtitle: '',
          imageUrl: '',
          imagePosition: 'left',
          description: ''
        }
      }
    case 'CallToActionBlock':
      return {
        _id: id,
        type,
        props: {
          message: '',
          buttonLabel: '',
          buttonUrl: '',
          learnMoreText: '',
          learnMoreUrl: ''
        }
      }
    case 'FAQsBlock':
      return { _id: id, type, props: { faqs: [] } }
    case 'FeaturesBlock':
      return { _id: id, type, props: { faqs: [] } }
    case 'ServicesBlock':
      return { _id: id, type, props: { services: [] } }
    default:
      throw new Error('Invalid block type')
  }
}

// Main form component
const SolutionForm: React.FC<SolutionFormProps> = ({
  solution,
  onSave,
  onCancel
}) => {
  // Use state to manage form data, initial state will use solution or a new object
  const [formData, setFormData] = useState<Solution>(
    solution || {
      name: '',
      description: '',
      icon: '',
      blocks: [],
      children: [],
      isPrimary: false,
      rank: 0
    }
  )

  // State for managing parent solutions, child solution check, selected parent ID, success modal, and error modal
  // const [parentSolutions, setParentSolutions] = useState<Solution[]>([])
  const [parentSolutions, setParentSolutions] = useState<any>([])
  const [isChildSolution, setIsChildSolution] = useState<boolean>(false)
  const [selectedParentId, setSelectedParentId] = useState<string>('')
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Fetch available parent solutions when component mounts
  useEffect(() => {
    const fetchParentSolutions = async () => {
      try {
        const solutions = await fetchSolutions()
        setParentSolutions(solutions)
      } catch (error) {
        console.error('Failed to fetch parent solutions:', error)
      }
    }

    fetchParentSolutions()
  }, [])

  // Function to handle adding a new block
  const handleAddBlock = (type: BlockOptionType) => {
    const newBlock = createNewBlock(type)
    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }))
  }

  // Function to handle block changes
  const handleBlockChange = (updatedBlock: BlockType) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block._id === updatedBlock._id ? updatedBlock : block
      )
    }))
  }

  const handleRemoveBlock = (_id: string) => {
    setFormData((prev) => {
      const updatedBlocks = prev.blocks.filter((block) => block._id !== _id)
      return { ...prev, blocks: updatedBlocks }
    })
  }

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Check for all required fields before submission
    if (!formData.name || !formData.description || !formData.icon) {
      setErrorMessage('All fields are required.')
      setShowErrorModal(true)
      return
    }

    try {
      // let savedSolution: Solution
      let savedSolution: any

      // Check if updating existing solution or creating a new one
      if (formData._id) {
        savedSolution = await updateSolution(formData._id, formData)
      } else {
        savedSolution = await createSolution(formData)
      }

      // Update parent solution if it's a child solution
      if (isChildSolution && selectedParentId) {
        const parentSolution = parentSolutions.find(
          (p: { _id: string }) => p._id === selectedParentId
        )
        if (parentSolution) {
          const updatedParent = {
            ...parentSolution,
            children: [...(parentSolution.children || []), savedSolution._id!]
          }
          await updateSolution(parentSolution._id!, updatedParent)
        }
      }

      // Trigger the onSave callback
      await onSave(savedSolution)

      // Show success modal
      setShowSuccessModal(true)
    } catch (error) {
      setErrorMessage('Failed to save solution.')
      setShowErrorModal(true)
    }
  }

  // Function to move a block up
  const moveBlockUp = (index: number) => {
    if (index <= 0) return
    const newBlocks = [...formData.blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[index - 1]
    newBlocks[index - 1] = temp
    setFormData({ ...formData, blocks: newBlocks })
  }

  // Function to move a block down
  const moveBlockDown = (index: number) => {
    if (index >= formData.blocks.length - 1) return
    const newBlocks = [...formData.blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[index + 1]
    newBlocks[index + 1] = temp
    setFormData({ ...formData, blocks: newBlocks })
  }

  // Function to handle modal close
  const handleModalClose = () => {
    setShowSuccessModal(false)
    setShowErrorModal(false)
    onCancel()
  }

  // Function to handle image upload success
  const handleImageUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, icon: url }))
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="space-y-4">
          {/* Solution Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Solution Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter solution name"
              required
            />
          </div>

          {/* Solution Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Enter solution description"
              required
            />
          </div>

          {/* Icon URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Icon URL
            </label>
            <ImageUploader
              onUploadSuccess={handleImageUploadSuccess}
              folder="solution-icons"
              maxFileSizeMB={5}
              uploadPreset="your-upload-preset"
              cloudName="your-cloud-name"
            />
            {formData.icon && (
              <img
                src={formData.icon}
                alt="Solution Icon Preview"
                className="mt-2 max-h-40 w-full object-cover"
              />
            )}
          </div>

          {/* Is Primary Checkbox */}
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.isPrimary}
                onChange={() =>
                  setFormData({ ...formData, isPrimary: !formData.isPrimary })
                }
                className="form-checkbox text-primary size-5"
              />
              <span className="ml-2 text-gray-700">
                Is this an ERP solution?
              </span>
            </label>
          </div>

          {/* Rank Input */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700">
              Rank
            </label>
            <input
              type="number"
              value={formData.rank}
              onChange={(e) =>
                setFormData({ ...formData, rank: parseInt(e.target.value, 10) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter solution rank"
              required
            />
          </div>

          {/* Child Solution Checkbox */}
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isChildSolution}
                onChange={() => setIsChildSolution(!isChildSolution)}
                className="form-checkbox text-primary size-5"
              />
              <span className="ml-2 text-gray-700">
                Is this a child solution?
              </span>
            </label>
          </div>

          {/* Parent Solution Selection */}
          {isChildSolution && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">
                Select Parent Solution
              </label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a parent solution</option>
                {parentSolutions.map(
                  (parent: { _id: string; name: string }) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.name}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Add Block Buttons */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Add Block
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {blockOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAddBlock(value)}
                  className="bg-primary flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label={`Add ${label} block`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Blocks */}
          <div>
            <h3 className="text-lg font-semibold">Blocks</h3>
            {formData.blocks.map((block, index) => (
              <div
                key={block._id}
                className="relative mb-4 rounded-md border bg-gray-100 p-4"
              >
                <BlockForm
                  block={block}
                  onChange={(updatedBlock) => handleBlockChange(updatedBlock)}
                  onRemove={() => handleRemoveBlock(block._id)}
                />
                <div className="absolute right-4 top-4 flex space-x-2">
                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => moveBlockUp(index)}
                    disabled={index === 0}
                    className={`${
                      index === 0
                        ? 'text-gray-400'
                        : 'hover:text-primary text-gray-700'
                    }`}
                  >
                    <ArrowUpIcon className="size-5" aria-hidden="true" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => moveBlockDown(index)}
                    disabled={index === formData.blocks.length - 1}
                    className={`${
                      index === formData.blocks.length - 1
                        ? 'text-gray-400'
                        : 'hover:text-primary text-gray-700'
                    }`}
                  >
                    <ArrowDownIcon className="size-5" aria-hidden="true" />
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => {
                      console.log('block._id: ', block._id)

                      handleRemoveBlock(block._id)
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary rounded px-4 py-2 text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="rounded-md bg-white p-6 text-center shadow-md">
            <h2 className="mb-4 text-lg font-bold">Success</h2>
            <p>The solution has been saved successfully.</p>
            <div className="mt-4">
              <button
                className="bg-primary rounded px-4 py-2 text-white hover:bg-indigo-700"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="rounded-md bg-white p-6 text-center shadow-md">
            <h2 className="mb-4 text-lg font-bold">Error</h2>
            <p>{errorMessage}</p>
            <div className="mt-4">
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SolutionForm
