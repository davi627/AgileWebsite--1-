import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface Feature {
  text: string;
}

interface Solution {
  id: number;
  name: string;
  shortDesc: string;
  fullDesc: string;
  features: Feature[];
  implementation: string;
}

interface SolutionCategory {
  _id?: string;
  title: string;
  imageUrl: string;
  solutions: Solution[];
}

const SolutionCategoryForm: React.FC = () => {
  const [categories, setCategories] = useState<SolutionCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<SolutionCategory>({
    title: '',
    imageUrl: '', 
    solutions: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };

  const handleSolutionChange = (index: number, field: string, value: string) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[index] = {
      ...updatedSolutions[index],
      [field]: value
    };
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    });
  };

  const handleFeatureChange = (solIndex: number, featIndex: number, value: string) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[solIndex].features[featIndex].text = value;
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    });
  };

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
    });
  };

  const addFeature = (solIndex: number) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[solIndex].features.push({ text: '' });
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    });
  };

  const removeSolution = (index: number) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions.splice(index, 1);
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    });
  };

  const removeFeature = (solIndex: number, featIndex: number) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[solIndex].features.splice(featIndex, 1);
    setCurrentCategory({
      ...currentCategory,
      solutions: updatedSolutions
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/solution-categories/${editingId}`, currentCategory);
      } else {
        await axios.post(`${API_BASE_URL}/api/solution-categories`, currentCategory);
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const editCategory = (category: SolutionCategory) => {
    setCurrentCategory(category);
    if (category._id) {
      setEditingId(category._id);
    }
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/solution-categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const resetForm = () => {
    setCurrentCategory({
      title: '',
      imageUrl: '',
      solutions: []
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Solution Categories</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Title</label>
          <input
            type="text"
            name="title"
            value={currentCategory.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={currentCategory.imageUrl}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
          {currentCategory.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
              <img 
                src={currentCategory.imageUrl} 
                alt="Category preview" 
                className="h-20 object-contain border rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Solutions</h3>
          {currentCategory.solutions.map((solution, solIndex) => (
            <div key={solIndex} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Solution {solIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSolution(solIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={solution.name}
                    onChange={(e) => handleSolutionChange(solIndex, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Short Description</label>
                  <input
                    type="text"
                    value={solution.shortDesc}
                    onChange={(e) => handleSolutionChange(solIndex, 'shortDesc', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                   
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Description</label>
                  <textarea
                    value={solution.fullDesc}
                    onChange={(e) => handleSolutionChange(solIndex, 'fullDesc', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Implementation</label>
                  <textarea
                    value={solution.implementation}
                    onChange={(e) => handleSolutionChange(solIndex, 'implementation', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={2}
                   
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Features</label>
                    <button
                      type="button"
                      onClick={() => addFeature(solIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Add Feature
                    </button>
                  </div>
                  {solution.features.map((feature, featIndex) => (
                    <div key={featIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) => handleFeatureChange(solIndex, featIndex, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(solIndex, featIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSolution}
            className="mt-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition duration-200"
          >
            Add Solution
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200"
          >
            {isLoading ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Existing Categories</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category._id} className="border p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {category.imageUrl && (
                  <img 
                    src={category.imageUrl} 
                    alt={category.title}
                    className="h-12 w-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h4 className="font-medium">{category.title}</h4>
                  <p className="text-sm text-gray-500">{category.solutions.length} solutions</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editCategory(category)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(category._id!)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionCategoryForm;