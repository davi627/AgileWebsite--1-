export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
