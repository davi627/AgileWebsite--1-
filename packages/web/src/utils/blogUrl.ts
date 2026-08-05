export function getBlogPath(blog: { slug?: string; _id: string }): string {
  return `/blog/${blog.slug || blog._id}`
}

export function isMongoObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value)
}
