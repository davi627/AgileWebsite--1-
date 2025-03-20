// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChildSolution extends Omit<Solution, 'children'> {
  _id: string
  name: string
  description: string
  icon: string
  blocks: any[]
  isPrimary: boolean
  slug: string
  rank: number
}

export interface Block {
  type: string
  props: any
}

export interface Solution {
  _id?: string
  name: string
  slug: string
  description: string
  icon?: string
  isPrimary: boolean
  rank: number
  children: ChildSolution[]
  blocks: Block[]
}
