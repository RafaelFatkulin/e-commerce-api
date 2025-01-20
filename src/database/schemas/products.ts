import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  description: text().notNull(),
  brandId: integer('brand_id'),
  categoryId: integer('category_id'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
})
