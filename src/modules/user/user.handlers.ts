import type { AppRouteHandler } from "types";
import type {
  CreateUserRoute,
  DeleteUserRoute,
  GetUserRoute,
  ListRoute,
  UpdateUserRoute,
} from "./user.routes";
import { createErrorResponse, createSuccessResponse } from "@utils/response";
import { HttpStatusCodes } from "@utils/status-codes";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUsers,
  updateUser,
} from "./user.service";

const getUserListHandler: AppRouteHandler<ListRoute> = async (c) => {
  const filter = c.req.valid("query");

  const { data, meta } = await getUsers(filter);

  return c.json(
    createSuccessResponse({
      data,
      meta,
    })
  );
};

const getUserHandler: AppRouteHandler<GetUserRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const user = await getUser(id);

  if (!user) {
    return c.json(
      createErrorResponse({ message: "Пользователь не найден" }),
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(createSuccessResponse({ data: user }), HttpStatusCodes.OK);
};

const createUserHandler: AppRouteHandler<CreateUserRoute> = async (c) => {
  const data = c.req.valid("json");

  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    return c.json(
      createErrorResponse({
        message: "Пользователь с таким Email уже существует",
      }),
      HttpStatusCodes.BAD_REQUEST
    );
  }

  try {
    const [user] = await createUser(data);

    return c.json(
      createSuccessResponse({
        message: `Пользователь ${user.fullName} создан`,
        data: user,
      }),
      HttpStatusCodes.CREATED
    );
  } catch {
    return c.json(
      createErrorResponse({ message: "Ошибка при создании пользователя" }),
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

const deleteUserHandler: AppRouteHandler<DeleteUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const existingUser = await getUser(id);

  if (!existingUser) {
    return c.json(
      createErrorResponse({
        message: "Пользователь не существует",
      }),
      HttpStatusCodes.NOT_FOUND
    );
  }

  try {
    const [user] = await deleteUser(id);

    return c.json(
      createSuccessResponse({
        message: `Пользователь ${user.fullName} удален`,
        data: user,
      }),
      HttpStatusCodes.OK
    );
  } catch {
    return c.json(
      createErrorResponse({ message: "Ошибка при удалении пользователя" }),
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

const updateUserHandler: AppRouteHandler<UpdateUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const existingUser = await getUser(id);

  if (!existingUser) {
    return c.json(
      createErrorResponse({
        message: "Пользователь не существует",
      }),
      HttpStatusCodes.NOT_FOUND
    );
  }

  try {
    const [updatedUser] = await updateUser(id, data);

    return c.json(
      createSuccessResponse({
        message: `Информация о пользователе обновлена`,
        data: updatedUser,
      }),
      HttpStatusCodes.OK
    );
  } catch {
    return c.json(
      createErrorResponse({
        message: "Ошибка при редактировании пользователя",
      }),
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

export const handlers = {
  list: getUserListHandler,
  get: getUserHandler,
  create: createUserHandler,
  update: updateUserHandler,
  delete: deleteUserHandler,
};
