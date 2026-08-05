import slugify from 'slugify'
import Blogs from '../Models/Blogs.js'

export function slugifyTitle(title = '') {
  const slug = slugify(title, { lower: true, strict: true, trim: true })
  return slug || 'blog-post'
}

export async function generateUniqueSlug(title, excludeId = null) {
  const base = slugifyTitle(title)
  let slug = base
  let counter = 1

  while (true) {
    const query = { slug }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }

    const existing = await Blogs.findOne(query).select('_id').lean()
    if (!existing) {
      return slug
    }

    slug = `${base}-${counter++}`
  }
}

export async function findBlogByIdOrSlug(param) {
  if (!param) return null

  if (/^[a-f0-9]{24}$/i.test(param)) {
    const byId = await Blogs.findById(param)
    if (byId) return byId
  }

  return Blogs.findOne({ slug: param })
}

export async function ensureBlogSlugs(blogs) {
  const missingSlug = blogs.filter((blog) => !blog.slug)

  for (const blog of missingSlug) {
    blog.slug = await generateUniqueSlug(blog.title, blog._id)
    await blog.save()
  }

  return blogs
}
