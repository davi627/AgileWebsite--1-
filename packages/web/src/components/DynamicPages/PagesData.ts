interface HeroBlockProps {
  title: string
  subtitle: string
  backgroundImage: string
}

interface ContentBlockProps {
  heading: string
  content: string
}

interface ImageGalleryProps {
  images: string[]
}

export type PageBlock =
  | { type: 'HeroBlock'; props: HeroBlockProps }
  | { type: 'ContentBlock'; props: ContentBlockProps }
  | { type: 'ImageGallery'; props: ImageGalleryProps }

type PagesData = {
  [key: string]: PageBlock[]
}

export const pagesData: PagesData = {
  '/home': [
    {
      type: 'HeroBlock',
      props: {
        title: 'Welcome to Our Site',
        subtitle: 'We are glad to have you here.',
        backgroundImage: '/path/to/image.jpg'
      }
    },
    {
      type: 'ContentBlock',
      props: {
        heading: 'About Us',
        content: 'We are a company that values excellence and quality.'
      }
    },
    {
      type: 'ImageGallery',
      props: {
        images: [
          '/path/to/image1.jpg',
          '/path/to/image2.jpg',
          '/path/to/image3.jpg'
        ]
      }
    }
  ],
  '/about': [
    {
      type: 'HeroBlock',
      props: {
        title: 'About Us',
        subtitle: 'Learn more about our journey.',
        backgroundImage: '/path/to/about-image.jpg'
      }
    },
    {
      type: 'ContentBlock',
      props: {
        heading: 'Our Mission',
        content: 'To deliver the best service to our customers.'
      }
    }
  ]
}
