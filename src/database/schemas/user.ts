import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRole = pgEnum('role', ['admin', 'user'])

export const user = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  fullName: varchar('fullname', { length: 128 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: userRole('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})
