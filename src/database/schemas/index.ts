import { user } from './user'

export const table = {
  user,
} as const

export type Table = typeof table
