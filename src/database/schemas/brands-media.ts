import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { brands } from './brands'
import { media } from './media'

export const brandsMedia = pgTable(
  'brands_media',
  {
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
  },
  table => [
    primaryKey({ columns: [table.brandId, table.mediaId] }),
  ],
)
