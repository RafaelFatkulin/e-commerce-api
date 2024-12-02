import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { sendError } from "@/utils/response";
import { ACCESS_TOKEN_COOKIE } from "./auth.constants";

type User = {
  id: number;
  email: string;
};

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, ACCESS_TOKEN_COOKIE);

    if (!token) {
      return c.json(sendError("Отсутствует токен авторизации"), 401);
    }

    const payload = (await verify(token, Bun.env.JWT_SECRET!)) as User;
    c.set("user", payload);

    await next();
  } catch (error) {
    return c.json(sendError("Недействительный токен"), 401);
  }
};
