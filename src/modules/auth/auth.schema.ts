import { table } from '@database/schemas'
import { z } from '@hono/zod-openapi'
import { userCreateSchema } from '@modules/user/user.schema'
import { emailField, phoneField } from '@utils/zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const refreshTokenSelectSchema = createSelectSchema(table.refreshToken).openapi('Refresh token schema')
export const refreshTokenCreateSchema = createInsertSchema(table.refreshToken).openapi('Refresh token create schema')
export const refreshTokenUpdateSchema = createUpdateSchema(table.refreshToken).pick({ revoked: true }).openapi('Refresh token update schema')

export const signupSchema = userCreateSchema.omit({
  role: true,
}).openapi('Signup schema')

export const signinSchema = z.object({
  email: emailField().openapi({ example: 'ivanov_i@vk.com' }),
  phone: phoneField().optional().openapi({ example: '88005553535' }),
})
