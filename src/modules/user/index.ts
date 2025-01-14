import { Hono } from "hono";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUsers,
  updateUser,
} from "./user.service";
import {
  userCreateSchema,
  usersFilterSchema,
  userUpdateSchema,
} from "./user.schema";
import { validateJsonSchema } from "@modules/core/helpers/validation";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@modules/core/helpers";
import { zValidator } from "@hono/zod-validator";

export const user = new Hono({});

user.get("/", zValidator("query", usersFilterSchema), async (c) => {
  const filter = c.req.valid("query");

  const { data, meta } = await getUsers(filter);

  return c.json(
    createSuccessResponse({
      data,
      meta,
    })
  );
});

user.get("/:id", async (c) => {
  const user = await getUser(Number(c.req.param("id")));

  if (!user) {
    return c.json(
      createErrorResponse({ message: "Пользователь не найден" }),
      404
    );
  }

  return c.json({ data: user });
});

user.post(
  "/",
  zValidator("json", userCreateSchema, validateJsonSchema),
  async (c) => {
    const data = c.req.valid("json");
    const existingUser = await getUserByEmail(data.email);

    if (existingUser) {
      return c.json(
        createErrorResponse({
          message: "Пользователь с таким Email уже существует",
        }),
        400
      );
    }

    try {
      const [user] = await createUser(data);

      return c.json(
        createSuccessResponse({
          message: `Пользователь ${user.fullName} создан`,
          data: user,
        })
      );
    } catch {
      return c.json(
        createErrorResponse({ message: "Ошибка при создании пользователя" }),
        500
      );
    }
  }
);

user.on(
  ["PATCH", "PUT"],
  "/:id",
  zValidator("json", userUpdateSchema, validateJsonSchema),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const existingUser = await getUser(id);

    if (!existingUser) {
      return c.json(
        createErrorResponse({
          message: "Пользователь не существует",
        }),
        404
      );
    }

    try {
      const [updatedUser] = await updateUser(id, data);

      return c.json(
        createSuccessResponse({
          message: `Информация о пользовалете обновлена`,
          data: updatedUser,
        })
      );
    } catch {
      return c.json(
        createErrorResponse({
          message: "Ошибка при редактировании пользователя",
        }),
        500
      );
    }
  }
);

user.delete("/:id", async (c) => {
  const existingUser = await getUser(Number(c.req.param("id")));

  if (!existingUser) {
    return c.json(
      createErrorResponse({
        message: "Пользователь не существует",
      }),
      404
    );
  }

  try {
    const [user] = await deleteUser(Number(c.req.param("id")));

    return c.json(
      createSuccessResponse({
        message: `Пользователь ${user.fullName} удален`,
      })
    );
  } catch {
    return c.json(
      createErrorResponse({ message: "Ошибка при удалении пользователя" }),
      500
    );
  }
});
