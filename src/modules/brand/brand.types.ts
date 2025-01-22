import type { z } from '@hono/zod-openapi'
import type {
  brandCreateSchema,
  brandSelectSchema,
  brandsFilterSchema,
  brandUpdateSchema,
} from './brand.schema'

export type Brand = z.infer<typeof brandSelectSchema>
export type CreateBrand = z.infer<typeof brandCreateSchema>
export type UpdateBrand = z.infer<typeof brandUpdateSchema>
export type BrandsFIlter = z.infer<typeof brandsFilterSchema>
