import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '../../services/FileUploadService'

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void
  folder?: string // Optionally specify a folder where images will be uploaded in Cloudinary
  maxFileSizeMB?: number
  uploadPreset: string
  cloudName?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  folder = 'default', // Default folder if none is provided
  maxFileSizeMB = 5
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxFileSizeMB}MB limit.`)
        return
      }

      setUploading(true)
      setError(null)
      setProgress(0)

      try {
        // Use the uploadFile service function to upload the file
        const uploadedUrl = await uploadFile(file, folder)

        // Call the onUploadSuccess callback with the uploaded URL
        onUploadSuccess(uploadedUrl)
      } catch (err) {
        setError('Failed to upload image. Please try again.')
        console.error('Error uploading image:', err)
      } finally {
        setUploading(false)
      }
    },
    [onUploadSuccess, folder, maxFileSizeMB]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  return (
    <div className="w-full max-w-md">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-300
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto size-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {uploading ? (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Uploading...</p>
            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Drag & drop an image, or click to select one
          </p>
        )}
      </div>
      {error && (
        <div
          className="mt-4 rounded-lg bg-red-100 p-4 text-sm text-red-700"
          role="alert"
        >
          <svg
            className="mr-2 inline size-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
