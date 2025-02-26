import { brands } from './brands'
import { brandsMedia } from './brands-media'
import { brandsMediaRelations } from './brands-media-relations'
import { brandsRelations } from './brands-relations'
import { categoriesRelations } from './categories-relations'
import { categories } from './category'
import { media } from './media'
import { mediaRelations } from './media-relations'
import { products } from './products'
import { productsRelations } from './products-relations'
import { refreshToken } from './refresh-token'
import { refreshTokenRelations } from './refresh-token-relations'
import { user } from './user'
import { userRelations } from './user-relations'

export {
  brands,
  brandsMedia,
  brandsMediaRelations,
  brandsRelations,
  categories,
  categoriesRelations,
  media,
  mediaRelations,
  products,
  productsRelations,
  refreshToken,
  refreshTokenRelations,
  user,
  userRelations,
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
