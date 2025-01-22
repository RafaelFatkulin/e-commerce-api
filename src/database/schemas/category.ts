import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  title: varchar('title', { length: 128 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  parentId: integer('parent_id').references((): AnyPgColumn => categories.id),
  order: integer('order'),
  isActive: boolean('is_active'),
})
