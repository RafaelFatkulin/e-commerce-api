import { integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const productStatus = pgEnum('product_status', ['active', 'not-active'])

export const products = pgTable('products', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  title: varchar('title', { length: 128 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text().notNull(),
  brandId: integer('brand_id'),
  categoryId: integer('category_id'),
  order: integer('order').default(0),
  status: productStatus('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
