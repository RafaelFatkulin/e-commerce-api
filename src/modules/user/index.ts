import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUsers,
} from "./user.service";
import { zValidator } from "@hono/zod-validator";
import { userCreateSchema } from "./user.schema";

export const user = new Hono({});

user.get("/", async (c) => {
  return c.json({
    data: await getUsers(),
  });
});

user.get("/:id", async (c) => {
  const user = await getUser(Number(c.req.param("id")));

  if (!user) {
    throw new HTTPException(404, { message: "Пользователь не найден" });
  }

  return c.json({ data: user });
});

user.post(
  "/",
  zValidator("json", userCreateSchema, (result, c) => {
    if (!result.success) {
      console.log(result.error.format);

      throw new HTTPException(400, result.error);
    }
  }),
  async (c) => {
    const data = c.req.valid("json");
    const existingUser = await getUserByEmail(data.email);

    if (existingUser) {
      throw new HTTPException(400, {
        message: "Пользователь с таким Email уже существует",
      });
    }

    try {
      const user = await createUser(data);

      return c.json({ data: user });
    } catch {
      throw new HTTPException(500, {
        message: "Ошибка при создании пользователя",
      });
    }
  }
);

user.delete("/:id", async (c) => {
  const existingUser = await getUser(Number(c.req.param("id")));

  if (!existingUser) {
    throw new HTTPException(404, { message: "Пользователь не существует" });
  }

  await deleteUser(Number(c.req.param("id")));

  return c.json({ message: "Пользователь удален" });
});
