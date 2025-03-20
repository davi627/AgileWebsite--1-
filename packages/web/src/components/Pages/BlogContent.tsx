import React from 'react'
import { BlogData } from '../../types'

const BlogContent: React.FC<BlogData> = ({
  title,
  description,
  content,
  author,
  date,
  images,
  tags
}) => {
  return (
    <div className="bg-white">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <p className="mb-2 text-gray-600">{description}</p>
      <p className="mb-6 text-gray-500">
        By {author} on {date}
      </p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      <div className="mt-4">
        {images.map((image, index) => (
          <img key={index} src={image} alt={title} className="my-2 w-full" />
        ))}
      </div>
      <div className="mt-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default BlogContent
