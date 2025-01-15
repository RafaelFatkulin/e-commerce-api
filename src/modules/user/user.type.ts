import type { z } from 'zod'
import type {
  userCreateSchema,
  userSelectSchema,
  usersFilterSchema,
  userUpdateSchema,
} from './user.schema'

export type CreateUser = z.infer<typeof userCreateSchema>
export type UpdateUser = z.infer<typeof userUpdateSchema>
export type User = z.infer<typeof userSelectSchema>
export type UsersFilter = z.infer<typeof usersFilterSchema>
