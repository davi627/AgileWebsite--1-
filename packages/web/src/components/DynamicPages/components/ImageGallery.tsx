import React from 'react'

interface ImageGalleryProps {
  images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Gallery Image ${index + 1}`} />
      ))}
    </div>
  )
}

export default ImageGallery
