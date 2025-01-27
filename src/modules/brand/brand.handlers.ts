import type { AppRouteHandler } from 'types'
import type {
  CreateRoute,
  DeleteRoute,
  GetRoute,
  ListRoute,
  UpdateRoute,
} from './brand.router'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrandByTitle,
  getBrands,
  updateBrand,
} from './brand.service'

const list: AppRouteHandler<ListRoute> = async (c) => {
  const filters = c.req.valid('query')
  const { data, meta } = await getBrands(filters)

  try {
    return c.json(
      createSuccessResponse({ data, meta }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ощибка при получении бренда' }),
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
      createErrorResponse({ message: 'Ошибка при получении брендов' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid('json')

  const existingBrand = await getBrandByTitle(data.title)

  if (existingBrand) {
    return c.json(
      createErrorResponse({
        message: `Бренд "${data.title}" уже существует`,
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  try {
    const [brand] = await createBrand(data)

    return c.json(
      createSuccessResponse({
        message: `Бренд "${brand.title}" создан`,
        data: brand,
      }),
      HttpStatusCodes.CREATED,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при создании бренда' }),
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

export const handlers = {
  list,
  get,
  create,
  update,
  delete: deleteHandler,
}
