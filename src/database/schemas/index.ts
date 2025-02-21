import { brandsMediaRelations } from './brands-media-relations';
import { brandsMedia } from './brands-media';
import { mediaRelations } from './media-relations';
import { media } from './media';
import { brands } from './brands'
import { brandsRelations } from './brands-relations'
import { categoriesRelations } from './categories-relations'
import { categories } from './category'
import { products } from './products'
import { productsRelations } from './products-relations'
import { refreshToken } from './refresh-token'
import { refreshTokenRelations } from './refresh-token-relations'
import { user } from './user'
import { userRelations } from './user-relations'

export {
  brands,
  brandsRelations,
  brandsMedia,
  brandsMediaRelations,
  categories,
  categoriesRelations,
  products,
  productsRelations,
  refreshToken,
  refreshTokenRelations,
  user,
  userRelations,
  media,
  mediaRelations,
}

export const table = {
  user,
  userRelations,
  refreshToken,
  refreshTokenRelations,
  products,
  productsRelations,
  brands,
  brandsRelations,
  brandsMedia,
  brandsMediaRelations,
  categories,
  categoriesRelations,
  media,
  mediaRelations,
} as const

export type Table = typeof table
