import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const brands = pgTable('brands', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  description: text('description'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
})
