export interface BasePageData {
  slug: string
  title: string
  description: string
  images: string[]
  content: string
  tags: string[]
}

export interface PageData extends BasePageData {
  type: 'pages'
}

export interface BlogData extends BasePageData {
  type: 'blog'
  date: string
  author: string
}

export type PageTypes = PageData | BlogData
