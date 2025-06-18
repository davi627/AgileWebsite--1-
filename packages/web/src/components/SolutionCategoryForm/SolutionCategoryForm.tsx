import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

interface Feature {
  text: string
}

interface Solution {
  id: number
  name: string
  shortDesc: string
  fullDesc: string
  features: Feature[]
  implementation: string
}

interface SolutionCategory {
  _id?: string
  title: string
  imageUrl: string
  solutions: Solution[]
}

interface FeatureItemProps {
  feature: Feature
  index: number
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  index,
  onChange,
  onRemove
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4', // Double spacing between paragraphs
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-none', // Remove list styling
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-none', // Remove list styling
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-4', // Add spacing between list items (now paragraphs)
          },
        },
      }),
    ],
    content: feature.text || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(index, html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[80px] p-2',
      },
    },
  })

  // Update editor content when feature changes
  useEffect(() => {
    if (editor && feature.text && feature.text !== editor.getHTML()) {
      editor.commands.setContent(feature.text, false, {
        preserveWhitespace: 'full'
      })
    }
  }, [editor, feature.text])

  return (
    <div className="flex gap-2 mb-3 items-start">
      <div className="flex-1 border border-gray-300 rounded-md min-h-20">
        <EditorContent editor={editor} />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 text-xs md:text-sm bg-red-50 hover:bg-red-100 px-2 py-1 rounded flex-shrink-0 mt-1"
      >
        Remove
      </button>
    </div>
  )
}

interface SolutionItemProps {
  solution: Solution
  index: number
  onChange: (index: number, field: string, value: string) => void
  onFeatureChange: (solIndex: number, featIndex: number, value: string) => void
  onAddFeature: (solIndex: number) => void
  onRemoveFeature: (solIndex: number, featIndex: number) => void
  onRemove: (index: number) => void
}

const SolutionItem: React.FC<SolutionItemProps> = ({
  solution,
  index,
  onChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onRemove
}) => {
  const fullDescEditor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
      }),
    ],
    content: solution.fullDesc || '',
    onUpdate: ({ editor }) => {
      onChange(index, 'fullDesc', editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3',
      },
    },
  })

  const implementationEditor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
      }),
    ],
    content: solution.implementation || '',
    onUpdate: ({ editor }) => {
      onChange(index, 'implementation', editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3',
      },
    },
  })

  // Update editors when solution data changes
  useEffect(() => {
    if (fullDescEditor && solution.fullDesc && solution.fullDesc !== fullDescEditor.getHTML()) {
      fullDescEditor.commands.setContent(solution.fullDesc, false, {
        preserveWhitespace: 'full'
      })
    }
  }, [fullDescEditor, solution.fullDesc])

  useEffect(() => {
    if (implementationEditor && solution.implementation && solution.implementation !== implementationEditor.getHTML()) {
      implementationEditor.commands.setContent(solution.implementation, false, {
        preserveWhitespace: 'full'
      })
    }
  }, [implementationEditor, solution.implementation])

  return (
    <div className="mb-3 p-3 md:p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm md:text-base">
          Solution {index + 1}
        </h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-xs md:text-sm bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
        >
          Remove Solution
        </button>
      </div>

      <div className="space-y-2 md:space-y-3">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={solution.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">
            Short Description
          </label>
          <input
            type="text"
            value={solution.shortDesc}
            onChange={(e) => onChange(index, 'shortDesc', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">
            Full Description
          </label>
          <div className="mt-1 border border-gray-300 rounded-md min-h-32">
            <EditorContent editor={fullDescEditor} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use formatting tools: Bold (Ctrl+B), Italic (Ctrl+I), etc.
          </p>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">
            Implementation
          </label>
          <div className="mt-1 border border-gray-300 rounded-md min-h-32">
            <EditorContent editor={implementationEditor} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use formatting tools: Bold (Ctrl+B), Italic (Ctrl+I), etc.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs md:text-sm font-medium text-gray-700">
              Features
            </label>
            <button
              type="button"
              onClick={() => onAddFeature(index)}
              className="text-xs md:text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
            >
              Add Feature
            </button>
          </div>

          {solution.features.map((feature, featIndex) => (
            <FeatureItem
              key={featIndex}
              feature={feature}
              index={featIndex}
              onChange={(featIndex, value) =>
                onFeatureChange(index, featIndex, value)
              }
              onRemove={(featIndex) => onRemoveFeature(index, featIndex)}
            />
          ))}
          {solution.features.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Each feature will be displayed as a separate paragraph with proper spacing
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const SolutionCategoryForm: React.FC = () => {
  const [categories, setCategories] = useState<SolutionCategory[]>([])
  const [currentCategory, setCurrentCategory] = useState<SolutionCategory>({
    title: '',
    imageUrl: '',
    solutions: []
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/solution-categories`
      )
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    })
  }

  const handleSolutionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSolutions = [...currentCategory.solutions]
    updatedSolutions[index] = {
      ...updatedSolutions[index],
      [field]: value
    }
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    })
  }

  const handleFeatureChange = (
    solIndex: number,
    featIndex: number,
    value: string
  ) => {
    const updatedSolutions = [...currentCategory.solutions]
    updatedSolutions[solIndex].features[featIndex].text = value
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    })
  }

  const addSolution = () => {
    setCurrentCategory({
      ...currentCategory,
      solutions: [
        ...currentCategory.solutions,
        {
          id: currentCategory.solutions.length + 1,
          name: '',
          shortDesc: '',
          fullDesc: '',
          features: [],
          implementation: ''
        }
      ]
    })
  }

  const addFeature = (solIndex: number) => {
    const updatedSolutions = [...currentCategory.solutions]
    updatedSolutions[solIndex].features.push({ text: '' })
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    })
  }

  const removeSolution = (index: number) => {
    const updatedSolutions = [...currentCategory.solutions]
    updatedSolutions.splice(index, 1)
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    })
  }

  const removeFeature = (solIndex: number, featIndex: number) => {
    const updatedSolutions = [...currentCategory.solutions]
    updatedSolutions[solIndex].features.splice(featIndex, 1)
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataToSend = {
        ...currentCategory,
        solutions: currentCategory.solutions.map(solution => ({
          ...solution,
          fullDesc: solution.fullDesc || '',
          implementation: solution.implementation || '',
          features: solution.features.map(feature => ({
            text: feature.text || ''
          }))
        }))
      }

      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/solution-categories/${editingId}`,
          dataToSend
        )
      } else {
        await axios.post(
          `${API_BASE_URL}/api/solution-categories`,
          dataToSend
        )
      }
      fetchCategories()
      resetForm()
    } catch (error) {
      console.error('Failed to save category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const editCategory = (category: SolutionCategory) => {
    const categoryToEdit = {
      ...category,
      solutions: category.solutions.map(solution => ({
        ...solution,
        features: [...solution.features]
      }))
    }

    setCurrentCategory(categoryToEdit)
    if (category._id) {
      setEditingId(category._id)
    }
  }

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/solution-categories/${id}`)
        fetchCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const resetForm = () => {
    setCurrentCategory({
      title: '',
      imageUrl: '',
      solutions: []
    })
    setEditingId(null)
  }

  const toggleMenu = (id: string) => {
    setIsMenuOpen(isMenuOpen === id ? null : id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">
        Manage Solution Categories
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category Title
          </label>
          <input
            type="text"
            name="title"
            value={currentCategory.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={currentCategory.imageUrl}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
          {currentCategory.imageUrl && (
            <div className="mt-2">
              <img
                src={currentCategory.imageUrl}
                alt="Category preview"
                className="h-16 md:h-20 object-contain border rounded"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-md md:text-lg font-medium mb-2">Solutions</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Rich Text Support:</strong> All text fields support formatting like <strong>bold</strong>, <em>italic</em>, and paragraphs.
              Features will be displayed as separate paragraphs with proper spacing.
            </p>
          </div>

          {currentCategory.solutions.map((solution, solIndex) => (
            <SolutionItem
              key={solIndex}
              solution={solution}
              index={solIndex}
              onChange={handleSolutionChange}
              onFeatureChange={handleFeatureChange}
              onAddFeature={addFeature}
              onRemoveFeature={removeFeature}
              onRemove={removeSolution}
            />
          ))}

          <button
            type="button"
            onClick={addSolution}
            className="mt-2 bg-indigo-100 text-primary px-3 py-1.5 text-sm md:text-base rounded-md transition duration-200 w-full md:w-auto"
          >
            + Add Solution
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200 text-sm md:text-base"
          >
            {isLoading
              ? 'Saving...'
              : editingId
                ? 'Update Category'
                : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200 text-sm md:text-base"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-4 md:mt-6">
        <h3 className="text-md md:text-lg font-medium mb-2 md:mb-4">
          Existing Categories
        </h3>
        <div className="space-y-2 md:space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="border p-2 md:p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  {category.imageUrl && (
                    <img
                      src={category.imageUrl}
                      alt={category.title}
                      className="h-8 w-8 md:h-10 md:w-10 object-cover rounded"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      {category.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      {category.solutions.length} solutions
                    </p>
                  </div>
                </div>

                <div className="relative md:hidden">
                  <button
                    onClick={() => toggleMenu(category._id!)}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Actions"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {isMenuOpen === category._id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            editCategory(category)
                            setIsMenuOpen(null)
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs text-primary hover:bg-primary hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteCategory(category._id!)
                            setIsMenuOpen(null)
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => editCategory(category)}
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-1 text-sm rounded hover:bg-indigo-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id!)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 text-sm rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SolutionCategoryForm
