import { Hono } from "hono";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
} from "./users.service";
import { zValidator } from "@hono/zod-validator";
import {
  insertUserSchema,
  updateUserSchema,
} from "@modules/users/users.schema";
import { sendError, sendSuccess } from "@/utils/response";
import { hash } from "@/utils/hash";

export const users = new Hono();

users.get("/", async (c) => {
  try {
    const users = await getUsers();
    return c.json(sendSuccess(users, "Список пользователей успешно получен"));
  } catch (error) {
    return c.json(sendError("Не удалось получить список пользователей"), 500);
  }
});

users.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const user = await getUserById(id);
    return c.json(sendSuccess(user, "Пользователь успешно найден"));
  } catch (error) {
    return c.json(sendError("Такой пользователь не найден"), 404);
  }
});

users.post("/", zValidator("json", insertUserSchema), async (c) => {
  try {
    const userData = c.req.valid("json");
    const existingUser = await getUserByEmail(userData.email).catch(() => null);

    if (existingUser) {
      return c.json(
        sendError("Пользователь с такой почтой уже существует"),
        409
      );
    }

    const hashedPassword = await hash(userData.password);
    const user = await createUser({ ...userData, password: hashedPassword });

    return c.json(
      sendSuccess(user, `Пользователь ${user.email} успешно создан`),
      201
    );
  } catch (error) {
    return c.json(sendError("Не удалось создать пользователя"), 500);
  }
});

users.patch("/:id", zValidator("json", updateUserSchema), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const userData = c.req.valid("json");

    const existingUser = await getUserById(id).catch(() => null);

    if (!existingUser) {
      return c.json(sendError("Такой пользователь не найден"), 404);
    }

    const updatedUser = await updateUser(id, userData);

    return c.json(
      sendSuccess(
        updatedUser,
        `Пользователь ${updatedUser.email} успешно обновлен`
      )
    );
  } catch (error) {
    return c.json(sendError("Не удалось обновить пользователя"), 500);
  }
});

users.delete("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const deletedUser = await deleteUser(id).catch(() => null);

    if (!deletedUser) {
      return c.json(sendError("Такой пользователь не найден"), 404);
    }

    return c.json(
      sendSuccess(
        deletedUser,
        `Пользователь ${deletedUser.email} успешно удален`
      )
    );
  } catch (error) {
    return c.json(sendError("Не удалось удалить пользователя"), 500);
  }
});
