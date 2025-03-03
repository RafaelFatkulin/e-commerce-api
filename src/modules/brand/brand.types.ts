import type { z } from '@hono/zod-openapi'
import type { Media } from '@modules/media'
import type {
  brandCreateSchema,
  brandMinimalSchema,
  brandSelectSchema,
  brandsFilterSchema,
  brandsMediaSchema,
  brandUpdateSchema,
} from './brand.schema'

export type Brand = z.infer<typeof brandSelectSchema>
export type CreateBrand = z.infer<typeof brandCreateSchema>
export type UpdateBrand = z.infer<typeof brandUpdateSchema>
export type BrandsFilter = z.infer<typeof brandsFilterSchema>
export type BrandsMedia = z.infer<typeof brandsMediaSchema>
export type MediaWithRelation = BrandsMedia & {
  media: Media
}

export type BrandWithMedia = Brand & {
  media: MediaWithRelation[]
}

export type BrandWithMediaOnly = Brand & {
  media: Media[]
}

export type BrandMinimal = z.infer<typeof brandMinimalSchema>