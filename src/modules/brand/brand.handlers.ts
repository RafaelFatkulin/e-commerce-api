import type { Media } from '@modules/media'
import type { AppRouteHandler } from 'types'
import type {
  CreateRoute,
  DeleteRoute,
  GetRoute,
  ListRoute,
  MinimalListRoute,
  UpdateRoute,
  UploadMediaRoute,
} from './brand.router'
import { db } from '@database'
import { table } from '@database/schemas'
import { deleteMediaByPath, uploadMedia } from '@modules/media'
import { getFilesArray } from '@utils/get-files-array'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrandByTitle,
  getBrandList,
  getBrands,
  updateBrand,
} from './brand.service'

const list: AppRouteHandler<ListRoute> = async (c) => {
  const filters = c.req.valid('query')

  try {
    const { data, meta } = await getBrands(filters)
    return c.json(
      createSuccessResponse({ data, meta }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при загрузке брендов' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const minimalList: AppRouteHandler<MinimalListRoute> = async (c) => {
  try {
    const brands = await getBrandList()
    return c.json(
      createSuccessResponse({ data: brands }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при загрузке брендов' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const get: AppRouteHandler<GetRoute> = async (c) => {
  const { id } = c.req.valid('param')

  try {
    const brand = await getBrandById(id)

    if (!brand) {
      return c.json(
        createErrorResponse({ message: 'Бренд не найден' }),
        HttpStatusCodes.NOT_FOUND,
      )
    }

    return c.json(
      createSuccessResponse({ data: brand }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при загрузке бренда' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = await c.req.formData()
  const title = body.get('title') as string
  const description = body.get('description') as string | undefined

  const files = getFilesArray(body)

  const data = {
    title,
    description,
    ...(files.length > 0 && { files }),
  }

  const existingBrand = await getBrandByTitle(title)
  if (existingBrand) {
    return c.json(
      createErrorResponse({
        message: `Бренд "${title}" уже существует`,
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  try {
    let mediaItems: Media[] = []

    if (files.length > 0) {
      mediaItems = await uploadMedia('brand', files)
    }

    const [brand] = await createBrand(data)

    if (mediaItems.length > 0) {
      for (const item of mediaItems) {
        await db.insert(table.brandsMedia).values({
          brandId: brand.id,
          mediaId: item.id,
        })
      }
    }

    return c.json(
      createSuccessResponse({
        message: `Бренд "${brand.title}" создан`,
        data: brand,
      }),
      HttpStatusCodes.CREATED,
    )
  }
  catch (error) {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при создании бренда',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const data = c.req.valid('json')
  const existingBrand = await getBrandById(id)

  if (!existingBrand) {
    return c.json(
      createErrorResponse({
        message: 'Бренд не найден',
      }),
      HttpStatusCodes.NOT_FOUND,
    )
  }

  try {
    const [updatedBrand] = await updateBrand(id, data)

    return c.json(
      createSuccessResponse({
        message: 'Информация о бренде обновлена',
        data: updatedBrand,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при редактировании бренда',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const deleteHandler: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const existingBrand = await getBrandById(id)

  if (!existingBrand) {
    return c.json(
      createErrorResponse({
        message: 'Бренд не существует',
      }),
      HttpStatusCodes.NOT_FOUND,
    )
  }

  try {
    const [brand] = await deleteBrand(id)

    for (const media of existingBrand.media) {
      deleteMediaByPath(media.path)
    }

    return c.json(
      createSuccessResponse({
        message: `Бренд "${brand.title}" удален`,
        data: brand,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при удалении бренда' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const uploadMediaFiles: AppRouteHandler<UploadMediaRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const body = await c.req.formData()
  const files = getFilesArray(body)

  const existingBrand = await getBrandById(id)
  if (!existingBrand) {
    return c.json(
      createErrorResponse({
        message: `Бренд не найден`,
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  try {
    let mediaItems: Media[] = []

    if (files.length) {
      mediaItems = await uploadMedia('brand', files)
    }

    if (mediaItems.length > 0) {
      for (const item of mediaItems) {
        await db.insert(table.brandsMedia).values({
          brandId: existingBrand.id,
          mediaId: item.id,
        })
      }
    }

    return c.json(
      createSuccessResponse({
        message: `Медиа-файлы загружены`,
        data: null,
      }),
      HttpStatusCodes.CREATED,
    )
  }
  catch {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при загрузке медиа-файлов',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

export const handlers = {
  list,
  get,
  create,
  update,
  delete: deleteHandler,
  uploadMedia: uploadMediaFiles,
  minimalList
}
