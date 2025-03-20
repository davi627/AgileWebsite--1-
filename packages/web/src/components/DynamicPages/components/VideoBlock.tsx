import React from 'react'

interface VideoBlockProps {
  title: string
  videoUrl: string
}

const VideoBlock: React.FC<VideoBlockProps> = ({ title, videoUrl }) => {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
        <div className="mt-6">
          <iframe
            width="100%"
            height="400"
            src={videoUrl}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default VideoBlock
