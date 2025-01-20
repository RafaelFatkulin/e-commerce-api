import { table } from '@database/schemas'
import { userRole } from '@database/schemas/user'
import { z } from '@hono/zod-openapi'
import { emailField, enumField, phoneField, stringField } from '@utils/zod'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'

export const userSelectSchema = createSelectSchema(table.user).omit({
  createdAt: true,
  updatedAt: true,
  password: true,
}).openapi('User Schema')

export const userCreateSchema = createInsertSchema(table.user, {
  fullName: stringField(4, 128).openapi({ example: 'Иванов Иван Иванович' }),
  email: emailField().openapi({ example: 'ivanov_i@vk.com' }),
  password: stringField(8, 64).optional().openapi({ example: '********' }),
  phone: phoneField().optional().openapi({ example: '88005553535' }),
  role: enumField(userRole.enumValues).openapi({ examples: userRole.enumValues }),
}).omit({
  createdAt: true,
  updatedAt: true,
}).openapi('User Create Schema')

export const userUpdateSchema = createUpdateSchema(table.user, {
  fullName: stringField(4, 128).optional().openapi({ example: 'Иванов Иван Иванович' }),
  email: emailField().optional().openapi({ example: 'ivanov_i@vk.com' }),
  password: stringField(8, 64).optional().openapi({ example: '********' }),
  phone: phoneField().optional().openapi({ example: '88005553535' }),
  role: enumField(userRole.enumValues).optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
}).openapi('User Update Schema')

export const usersFilterSchema = z.object({
  q: z.string().optional().openapi({}),
  page: z.string().optional(),
  role: z.enum(userRole.enumValues).optional(),
  per_page: z.string().optional(),
  sort_by: userSelectSchema.keyof().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
})
