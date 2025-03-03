import { AppRouteHandler } from "types";
import { CreateRoute, DeleteRoute, EditRoute, GetBySlugRoute, GetRoute, ListRoute } from "./products.router";
import { createProduct, deleteProduct, getProductById, getProductBySlug, getProductByTitle, getProducts, updateProduct } from "./products.service";
import { createErrorResponse, createSuccessResponse } from "@utils/response";
import { HttpStatusCodes } from "@utils/status-codes";

const list: AppRouteHandler<ListRoute> = async (c) => {
    const filters = c.req.valid('query')
    console.log("@filters", filters);


    try {
        const { data, meta } = await getProducts(filters)

        return c.json(
            createSuccessResponse({ data, meta }),
            HttpStatusCodes.OK
        )
    } catch {
        return c.json(
            createErrorResponse({ message: 'Ощибка при загрузке товаров' }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

const get: AppRouteHandler<GetRoute> = async (c) => {
    const { id } = c.req.valid('param')

    try {
        const product = await getProductById(id)

        if (!product) {
            return c.json(
                createErrorResponse({ message: 'Товар не найден' }),
                HttpStatusCodes.NOT_FOUND
            )
        }

        return c.json(
            createSuccessResponse({ data: product }),
            HttpStatusCodes.OK
        )
    } catch {
        return c.json(
            createErrorResponse({ message: 'Ошибка при загрузке товара' }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

const getBySlug: AppRouteHandler<GetBySlugRoute> = async (c) => {
    const { slug } = c.req.valid('param')

    try {
        const product = await getProductBySlug(slug)

        if (!product) {
            return c.json(
                createErrorResponse({ message: 'Товар не найден' }),
                HttpStatusCodes.NOT_FOUND
            )
        }

        return c.json(
            createSuccessResponse({ data: product }),
            HttpStatusCodes.OK
        )
    } catch {
        return c.json(
            createErrorResponse({ message: 'Ошибка при загрузке товара' }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

const create: AppRouteHandler<CreateRoute> = async (c) => {
    const data = c.req.valid('json')

    const existingProduct = await getProductByTitle(data.title)

    if (existingProduct) {
        return c.json(
            createErrorResponse({ message: 'Товар с таким названием уже существует' }),
            HttpStatusCodes.BAD_REQUEST
        )
    }

    try {
        const [product] = await createProduct(data)
        console.log(product);

        return c.json(
            createSuccessResponse({
                message: `Товар "${product.title}" создан`,
                data: product,
            }),
            HttpStatusCodes.CREATED,
        )
    } catch (err) {
        console.log(err);

        return c.json(
            createErrorResponse({
                message: 'Ошибка при создании товара',
            }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

const edit: AppRouteHandler<EditRoute> = async (c) => {
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')

    const existingProduct = await getProductById(id)

    if (!existingProduct) {
        return c.json(
            createErrorResponse({
                message: 'Товар не найден',
            }),
            HttpStatusCodes.NOT_FOUND,
        )
    }

    if (data.title) {
        const productWithTitle = await getProductByTitle(data.title)

        if (productWithTitle && productWithTitle.id !== id) {
            return c.json(
                createErrorResponse({
                    message: 'Товар с таким названием уже существует',
                }),
                HttpStatusCodes.BAD_REQUEST,
            )
        }
    }

    try {
        const [updatedProduct] = await updateProduct(id, data)

        return c.json(
            createSuccessResponse({
                message: `Информация о товаре обновлена`,
                data: updatedProduct,
            }),
            HttpStatusCodes.OK,
        )
    }
    catch (error) {
        return c.json(
            createErrorResponse({
                message: 'Ошибка при редактировании товара',
            }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

const deleteProductHandler: AppRouteHandler<DeleteRoute> = async (c) => {
    const { id } = c.req.valid('param')
    const existingProduct = await getProductById(id)

    if (!existingProduct) {
        return c.json(
            createErrorResponse({
                message: 'Товар не существует',
            }),
            HttpStatusCodes.NOT_FOUND,
        )
    }

    try {
        const [product] = await deleteProduct(id)

        return c.json(
            createSuccessResponse({
                message: `Товар "${product.title}" удален`,
                data: product,
            }),
            HttpStatusCodes.OK,
        )
    }
    catch {
        return c.json(
            createErrorResponse({ message: 'Ошибка при удалении товара' }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

export const handlers = {
    list,
    get,
    getBySlug,
    create,
    edit,
    delete: deleteProductHandler
}