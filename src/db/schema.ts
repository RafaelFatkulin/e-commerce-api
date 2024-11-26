import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const user = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 32}).notNull(),
    surname: varchar({length: 32}).notNull(),
    patronymic: varchar({length: 32}),
    email: varchar({length: 255}).notNull().unique(),
    password: varchar({length: 60}).notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
})

export const table = {
    user
} as const

export type Table = typeof table