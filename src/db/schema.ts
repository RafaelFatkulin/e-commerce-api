import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  numeric,
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

export const categoriesRelations = relations(category, ({ many }) => ({
  categoriesToProducts: many(categoriesToProducts),
}));

// COLOR
export const color = pgTable("colors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 50 }).notNull().unique(),
  value: varchar({ length: 50 }).notNull(),
});

export const colorRelations = relations(color, ({ many }) => ({
  products: many(product),
}));

// SIZE
export const size = pgTable("sizes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 12 }).notNull().unique(),
  details: jsonb().$type<{
    ru?: string;
    us?: string;
    uk?: string;
    jp?: string;
    gr?: string;
    fr?: string;
    it?: string;
  }>(),
});

export const sizeRelations = relations(size, ({ many }) => ({
  products: many(product),
}));

// MANUFACTURER
export const manufacturer = pgTable("manufacturers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 50 }).notNull().unique(),
});

export const manufacturerRelations = relations(manufacturer, ({ many }) => ({
  productsInfo: many(productInfo),
}));

//  PRODUCT
export const productInfo = pgTable("products_info", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  manufacturerId: integer("manufacturer_id"),

  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

// RELATIONS

export const productsInfoRelations = relations(
  productInfo,
  ({ one, many }) => ({
    categoriesToProducts: many(categoriesToProducts),
    manufacturer: one(manufacturer, {
      fields: [productInfo.manufacturerId],
      references: [manufacturer.id],
    }),
    products: many(product),
  })
);

export const categoriesToProducts = pgTable("categories_to_products", {
  categoryId: integer("category_id")
    .notNull()
    .references(() => category.id),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id),
});

export const product = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productInfoId: integer("products_info_id").notNull(),
  colorId: integer("color_id").notNull(),
  sizeId: integer("size_id").notNull(),
  count: integer().notNull(),
  price: numeric({ precision: 2 }).notNull(),
});

export const productRelations = relations(product, ({ one }) => ({
  productInfo: one(productInfo, {
    fields: [product.productInfoId],
    references: [productInfo.id],
  }),
  color: one(color, {
    fields: [product.colorId],
    references: [color.id],
  }),
  size: one(size, {
    fields: [product.sizeId],
    references: [size.id],
  }),
}));

// Экспорт таблиц для использования в приложении
export const table = {
  user,
  category,
  color,
  size,
  manufacturer,
  productInfo,
  product,
} as const;

export type Table = typeof table;
