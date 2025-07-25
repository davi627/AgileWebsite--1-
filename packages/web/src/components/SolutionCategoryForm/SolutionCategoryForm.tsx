import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
  imageUrl?: string;
}

interface SolutionCategory {
  _id?: string;
  title: string;
  imageUrl: string;
  sectionImageUrl?: string;
  description: string;
  solutions: Solution[];
}

const cleanHtmlContent = (html: string) => {
  if (!html) return '';
  let cleaned = html.replace(/<p>/g, '<p class="mb-4">');
  cleaned = cleaned.replace(/<p class="mb-4"><\/p>/g, '').replace(/<p>(<br>|\s)*<\/p>/g, '');
  return cleaned;
};

const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('data:')) return imageUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
};

interface FeatureItemProps {
  feature: Feature;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, index, onChange, onRemove }) => {
  const editor = useEditor({
    extensions: [StarterKit.configure({ paragraph: { HTMLAttributes: { class: 'mb-4' } }, bulletList: false, orderedList: false, listItem: false })],
    content: feature.text || '',
    onUpdate: ({ editor }) => onChange(index, cleanHtmlContent(editor.getHTML())),
    editorProps: { attributes: { class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[80px] p-2' } },
  });

  useEffect(() => {
    if (editor && feature.text && feature.text !== editor.getHTML()) {
      editor.commands.setContent(cleanHtmlContent(feature.text), false, { preserveWhitespace: 'full' });
    }
  }, [editor, feature.text]);

  return (
    <div className="flex gap-2 mb-3 items-start">
      <div className="flex-1 border border-gray-300 rounded-md min-h-20">
        <EditorContent editor={editor} />
      </div>
      <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 text-xs md:text-sm bg-red-50 hover:bg-red-100 px-2 py-1 rounded flex-shrink-0 mt-1">
        Remove
      </button>
    </div>
  );
};

interface SolutionItemProps {
  solution: Solution;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onFeatureChange: (solIndex: number, featIndex: number, value: string) => void;
  onAddFeature: (solIndex: number) => void;
  onRemoveFeature: (solIndex: number, featIndex: number) => void;
  onRemove: (index: number) => void;
  onImageChange: (index: number, file: File | null) => void;
  solutionImagePreview: string | null;
}

const SolutionItem: React.FC<SolutionItemProps> = ({
  solution,
  index,
  onChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onRemove,
  onImageChange,
  solutionImagePreview,
}) => {
  const fullDescEditor = useEditor({
    extensions: [StarterKit.configure({ paragraph: { HTMLAttributes: { class: 'mb-4' } } })],
    content: cleanHtmlContent(solution.fullDesc),
    onUpdate: ({ editor }) => onChange(index, 'fullDesc', cleanHtmlContent(editor.getHTML())),
    editorProps: { attributes: { class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3' } },
  });

  const implementationEditor = useEditor({
    extensions: [StarterKit.configure({ paragraph: { HTMLAttributes: { class: 'mb-4' } } })],
    content: cleanHtmlContent(solution.implementation),
    onUpdate: ({ editor }) => onChange(index, 'implementation', cleanHtmlContent(editor.getHTML())),
    editorProps: { attributes: { class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3' } },
  });

  useEffect(() => {
    if (fullDescEditor && solution.fullDesc && solution.fullDesc !== fullDescEditor.getHTML()) {
      fullDescEditor.commands.setContent(cleanHtmlContent(solution.fullDesc), false, { preserveWhitespace: 'full' });
    }
  }, [fullDescEditor, solution.fullDesc]);

  useEffect(() => {
    if (implementationEditor && solution.implementation && solution.implementation !== implementationEditor.getHTML()) {
      implementationEditor.commands.setContent(cleanHtmlContent(solution.implementation), false, { preserveWhitespace: 'full' });
    }
  }, [implementationEditor, solution.implementation]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }
      onImageChange(index, file);
    }
  };

  return (
    <div className="mb-3 p-3 md:p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm md:text-base">Solution {index + 1}</h4>
        <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 text-xs md:text-sm bg-red-50 hover:bg-red-100 px-2 py-1 rounded">
          Remove Solution
        </button>
      </div>

      <div className="space-y-2 md:space-y-3">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={solution.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">Short Description</label>
          <input
            type="text"
            value={solution.shortDesc}
            onChange={(e) => onChange(index, 'shortDesc', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">Full Description</label>
          <div className="mt-1 border border-gray-300 rounded-md min-h-32">
            <EditorContent editor={fullDescEditor} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Use formatting tools: Bold (Ctrl+B), Italic (Ctrl+I), etc.</p>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">Implementation</label>
          <div className="mt-1 border border-gray-300 rounded-md min-h-32">
            <EditorContent editor={implementationEditor} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Use formatting tools: Bold (Ctrl+B), Italic (Ctrl+I), etc.</p>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700">Solution Image</label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor={`solution-image-upload-${index}`}
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {solutionImagePreview || solution.imageUrl ? 'Change Image' : 'Upload Image'}
            </label>
            <input
              id={`solution-image-upload-${index}`}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
            {(solutionImagePreview || solution.imageUrl) && (
              <button
                type="button"
                onClick={() => onImageChange(index, null)}
                className="ml-2 bg-red-100 text-red-600 py-2 px-3 rounded-md text-sm"
              >
                Remove
              </button>
            )}
          </div>
          {(solutionImagePreview || solution.imageUrl) && (
            <div className="mt-2">
              <img
                src={solutionImagePreview || getImageUrl(solution.imageUrl!)}
                alt="Solution preview"
                className="h-16 md:h-20 object-contain border rounded"
                onError={(e) => {
                  console.error('Failed to load solution image:', solutionImagePreview || solution.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs md:text-sm font-medium text-gray-700">Features</label>
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
              onChange={(featIndex, value) => onFeatureChange(index, featIndex, value)}
              onRemove={(featIndex) => onRemoveFeature(index, featIndex)}
            />
          ))}
          {solution.features.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">Each feature will be displayed as a separate paragraph with proper spacing</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SolutionCategoryForm: React.FC = () => {
  const [categories, setCategories] = useState<SolutionCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<SolutionCategory>({
    title: '',
    imageUrl: '',
    sectionImageUrl: '',
    description: '',
    solutions: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const [sectionImageFile, setSectionImageFile] = useState<File | null>(null);
  const [sectionImagePreview, setSectionImagePreview] = useState<string | null>(null);
  const [solutionImageFiles, setSolutionImageFiles] = useState<(File | null)[]>([]);
  const [solutionImagePreviews, setSolutionImagePreviews] = useState<(string | null)[]>([]);

  useEffect(() => {
    fetchCategories();
    return () => {
      // Cleanup image previews to prevent memory leaks
      [categoryImagePreview, sectionImagePreview, ...solutionImagePreviews].forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [categoryImagePreview, sectionImagePreview, solutionImagePreviews]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleSolutionChange = (index: number, field: string, value: string) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[index] = { ...updatedSolutions[index], [field]: value };
    setCurrentCategory({ ...currentCategory, solutions: updatedSolutions });
  };

  const handleFeatureChange = (solIndex: number, featIndex: number, value: string) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[solIndex].features[featIndex].text = value;
    setCurrentCategory({ ...currentCategory, solutions: updatedSolutions });
  };

  const handleImageChange = (setter: React.Dispatch<React.SetStateAction<File | null>>, previewSetter: React.Dispatch<React.SetStateAction<string | null>>, field: 'imageUrl' | 'sectionImageUrl') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }
      setter(file);
      const previewUrl = URL.createObjectURL(file);
      previewSetter(previewUrl);
      setCurrentCategory({ ...currentCategory, [field]: '' });
      console.log(`Selected ${field} file:`, file.name, `Preview URL:`, previewUrl);
    }
  };

  const handleSolutionImageChange = (index: number, file: File | null) => {
    const updatedImageFiles = [...solutionImageFiles];
    const updatedImagePreviews = [...solutionImagePreviews];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }
      updatedImageFiles[index] = file;
      const previewUrl = URL.createObjectURL(file);
      updatedImagePreviews[index] = previewUrl;
      console.log(`Selected solution image ${index}:`, file.name, `Preview URL:`, previewUrl);
    } else {
      updatedImageFiles[index] = null;
      if (updatedImagePreviews[index]) {
        URL.revokeObjectURL(updatedImagePreviews[index]!);
      }
      updatedImagePreviews[index] = null;
    }
    setSolutionImageFiles(updatedImageFiles);
    setSolutionImagePreviews(updatedImagePreviews);

    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[index] = { ...updatedSolutions[index], imageUrl: file ? '' : updatedSolutions[index].imageUrl };
    setCurrentCategory({ ...currentCategory, solutions: updatedSolutions });
  };

  const addSolution = () => {
    setCurrentCategory({
      ...currentCategory,
      solutions: [
        ...currentCategory.solutions,
        { id: currentCategory.solutions.length + 1, name: '', shortDesc: '', fullDesc: '', features: [], implementation: '', imageUrl: '' },
      ],
    });
    setSolutionImageFiles([...solutionImageFiles, null]);
    setSolutionImagePreviews([...solutionImagePreviews, null]);
  };

  const addFeature = (solIndex: number) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[solIndex].features.push({ text: '' });
    setCurrentCategory({ ...currentCategory, solutions: updatedSolutions });
  };

  const removeSolution = (index: number) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions.splice(index, 1);
    setCurrentCategory({ ...currentCategory, solutions: updatedSolutions });

    const updatedImageFiles = [...solutionImageFiles];
    const updatedImagePreviews = [...solutionImagePreviews];
    if (updatedImagePreviews[index]) {
      URL.revokeObjectURL(updatedImagePreviews[index]!);
    }
    updatedImageFiles.splice(index, 1);
    updatedImagePreviews.splice(index, 1);
    setSolutionImageFiles(updatedImageFiles);
    setSolutionImagePreviews(updatedImagePreviews);
  };

  const removeFeature = (solIndex: number, featIndex: number) => {
    const updatedSolutions = [...currentCategory.solutions];
    updatedSolutions[solIndex].features.splice(featIndex, 1);
    setCurrentCategory({ ...currentCategory, solutions: updatedSolutions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', currentCategory.title);
      formData.append('description', currentCategory.description || '');
      if (categoryImageFile) {
        formData.append('categoryImage', categoryImageFile);
        console.log('Appending categoryImage:', categoryImageFile.name);
      } else if (currentCategory.imageUrl) {
        formData.append('existingCategoryImageUrl', currentCategory.imageUrl);
        console.log('Appending existingCategoryImageUrl:', currentCategory.imageUrl);
      }
      if (sectionImageFile) {
        formData.append('sectionImage', sectionImageFile);
        console.log('Appending sectionImage:', sectionImageFile.name);
      } else if (currentCategory.sectionImageUrl) {
        formData.append('existingSectionImageUrl', currentCategory.sectionImageUrl);
        console.log('Appending existingSectionImageUrl:', currentCategory.sectionImageUrl);
      }
      solutionImageFiles.forEach((file, index) => {
        if (file) {
          formData.append('solutionImages', file);
          console.log(`Appending solutionImage[${index}]:`, file.name);
        }
      });
      currentCategory.solutions.forEach((solution, index) => {
        if (solution.imageUrl && !solutionImageFiles[index]) {
          formData.append(`existingSolutionImageUrl[${index}]`, solution.imageUrl);
          console.log(`Appending existingSolutionImageUrl[${index}]:`, solution.imageUrl);
        }
      });
      formData.append(
        'solutions',
        JSON.stringify(
          currentCategory.solutions.map((solution) => ({
            ...solution,
            fullDesc: cleanHtmlContent(solution.fullDesc || ''),
            implementation: cleanHtmlContent(solution.implementation || ''),
            features: solution.features.map((feature) => ({ text: cleanHtmlContent(feature.text || '') })),
          }))
        )
      );

      console.log('Submitting FormData:', Object.fromEntries(formData));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const response = editingId
        ? await axios.put(`${API_BASE_URL}/api/solution-categories/${editingId}`, formData, config)
        : await axios.post(`${API_BASE_URL}/api/solution-categories`, formData, config);

      console.log('Server response:', response.data);

      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const editCategory = (category: SolutionCategory) => {
    const categoryToEdit = {
      ...category,
      imageUrl: getImageUrl(category.imageUrl),
      sectionImageUrl: getImageUrl(category.sectionImageUrl || ''),
      description: category.description || '',
      solutions: category.solutions.map((solution) => ({
        ...solution,
        imageUrl: getImageUrl(solution.imageUrl || ''),
        features: [...solution.features],
      })),
    };
    setCurrentCategory(categoryToEdit);
    setCategoryImageFile(null);
    setCategoryImagePreview(null);
    setSectionImageFile(null);
    setSectionImagePreview(null);
    setSolutionImageFiles(category.solutions.map(() => null));
    setSolutionImagePreviews(category.solutions.map(() => null));
    if (category._id) {
      setEditingId(category._id);
    }
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/solution-categories/${id}`);
        await fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const resetForm = () => {
    [categoryImagePreview, sectionImagePreview, ...solutionImagePreviews].forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setCurrentCategory({ title: '', imageUrl: '', sectionImageUrl: '', description: '', solutions: [] });
    setCategoryImageFile(null);
    setCategoryImagePreview(null);
    setSectionImageFile(null);
    setSectionImagePreview(null);
    setSolutionImageFiles([]);
    setSolutionImagePreviews([]);
    setEditingId(null);
  };

  const toggleMenu = (id: string) => {
    setIsMenuOpen(isMenuOpen === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">Manage Solution Categories</h2>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Title</label>
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
          <label className="block text-sm font-medium text-gray-700">Category Description</label>
          <textarea
            name="description"
            value={currentCategory.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm md:text-base focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
            required
            placeholder="Enter a brief description that will be displayed on the solutions page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category Image</label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="category-image-upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {categoryImageFile || currentCategory.imageUrl ? 'Change Image' : 'Upload Image'}
            </label>
            <input
              id="category-image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange(setCategoryImageFile, setCategoryImagePreview, 'imageUrl')}
            />
            {(categoryImageFile || currentCategory.imageUrl) && (
              <button
                type="button"
                onClick={() => {
                  if (categoryImagePreview) URL.revokeObjectURL(categoryImagePreview);
                  setCategoryImageFile(null);
                  setCategoryImagePreview(null);
                  setCurrentCategory({ ...currentCategory, imageUrl: '' });
                }}
                className="ml-2 bg-red-100 text-red-600 py-2 px-3 rounded-md text-sm"
              >
                Remove
              </button>
            )}
          </div>
          {(categoryImagePreview || currentCategory.imageUrl) && (
            <div className="mt-2">
              <img
                src={categoryImagePreview || getImageUrl(currentCategory.imageUrl)}
                alt="Category preview"
                className="h-16 md:h-20 object-contain border rounded"
                onError={(e) => {
                  console.error('Failed to load category image:', categoryImagePreview || currentCategory.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Section Image</label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="section-image-upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {sectionImageFile || currentCategory.sectionImageUrl ? 'Change Image' : 'Upload Image'}
            </label>
            <input
              id="section-image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange(setSectionImageFile, setSectionImagePreview, 'sectionImageUrl')}
            />
            {(sectionImageFile || currentCategory.sectionImageUrl) && (
              <button
                type="button"
                onClick={() => {
                  if (sectionImagePreview) URL.revokeObjectURL(sectionImagePreview);
                  setSectionImageFile(null);
                  setSectionImagePreview(null);
                  setCurrentCategory({ ...currentCategory, sectionImageUrl: '' });
                }}
                className="ml-2 bg-red-100 text-red-600 py-2 px-3 rounded-md text-sm"
              >
                Remove
              </button>
            )}
          </div>
          {(sectionImagePreview || currentCategory.sectionImageUrl) && (
            <div className="mt-2">
              <img
                src={sectionImagePreview || getImageUrl(currentCategory.sectionImageUrl!)}
                alt="Section preview"
                className="h-16 md:h-20 object-contain border rounded"
                onError={(e) => {
                  console.error('Failed to load section image:', sectionImagePreview || currentCategory.sectionImageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-md md:text-lg font-medium mb-2">Solutions</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Rich Text Support:</strong> All text fields support formatting like <strong>bold</strong>, <em>italic</em>, and paragraphs. Features will be displayed as separate paragraphs with proper spacing.
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
              onImageChange={handleSolutionImageChange}
              solutionImagePreview={solutionImagePreviews[solIndex]}
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
            {isLoading ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
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
        <h3 className="text-md md:text-lg font-medium mb-2 md:mb-4">Existing Categories</h3>
        <div className="space-y-2 md:space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="border p-2 md:p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  {category.imageUrl && (
                    <img
                      src={getImageUrl(category.imageUrl)}
                      alt={category.title}
                      className="h-8 w-8 md:h-10 md:w-10 object-cover rounded"
                      onError={(e) => {
                        console.error('Failed to load category image in list:', category.imageUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-sm md:text-base">{category.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500">{category.solutions.length} solutions</p>
                  </div>
                </div>

                <div className="relative md:hidden">
                  <button
                    onClick={() => toggleMenu(category._id!)}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Actions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {isMenuOpen === category._id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            editCategory(category);
                            setIsMenuOpen(null);
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs text-primary hover:bg-primary hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteCategory(category._id!);
                            setIsMenuOpen(null);
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
  );
};

export default SolutionCategoryForm;
