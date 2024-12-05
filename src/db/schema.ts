import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// USER'S ROLE
export const roleEnum = pgEnum("role", ["admin", "user"]);

// USER
export const user = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role: roleEnum().default("user").notNull(),
  name: varchar({ length: 32 }).notNull(),
  surname: varchar({ length: 32 }).notNull(),
  patronymic: varchar({ length: 32 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 60 }).notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

//  CATEGORY
export const category = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull().unique(),
  slug: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

//  PRODUCT
export const product = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

// RELATIONS
export const categoriesRelations = relations(category, ({ many }) => ({
  categoriesToProducts: many(categoriesToProducts),
}));

export const productsRelations = relations(product, ({ many }) => ({
  categoriesToProducts: many(categoriesToProducts),
}));

export const categoriesToProducts = pgTable("categories_to_products", {
  categoryId: integer("category_id")
    .notNull()
    .references(() => category.id),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id),
});

// Экспорт таблиц для использования в приложении
export const table = {
  user,
  category,
  product,
} as const;

export type Table = typeof table;
