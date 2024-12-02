import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema, refreshTokenSchema } from "./auth.schema";
import { login, register, refreshTokens, getCurrentUser } from "./auth.service";
import { sendError, sendSuccess } from "@/utils/response";
import { getUserByEmail } from "../users/users.service";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
} from "./auth.constants";

export const auth = new Hono();

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const user = await getUserByEmail(data.email);

    if (!user) {
      return c.json(sendError("Неверный email или пароль"), 401);
    }

    const result = await login(data);

    setCookie(c, ACCESS_TOKEN_COOKIE, result.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 15 * 60, // 15 минут
    });

    setCookie(c, REFRESH_TOKEN_COOKIE, result.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60, // 30 дней
    });

    return c.json(
      sendSuccess(
        { user: result.user },
        `Добро пожаловать, ${result.user.email}!`
      )
    );
  } catch (error) {
    return c.json(sendError("Ошибка при входе"), 500);
  }
});

auth.post("/register", zValidator("json", registerSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const existingUser = await getUserByEmail(data.email).catch(() => null);

    if (existingUser) {
      return c.json(
        sendError("Пользователь с такой почтой уже существует"),
        409
      );
    }

    const result = await register(data);

    setCookie(c, ACCESS_TOKEN_COOKIE, result.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    setCookie(c, REFRESH_TOKEN_COOKIE, result.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json(
      sendSuccess(
        { user: result.user },
        `Пользователь ${result.user.email} успешно зарегистрирован`
      ),
      201
    );
  } catch (error) {
    return c.json(sendError("Ошибка при регистрации"), 500);
  }
});

auth.post("/refresh", async (c) => {
  try {
    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE);

    if (!refreshToken) {
      return c.json(sendError("Отсутствует refresh token"), 401);
    }

    const tokens = await refreshTokens(refreshToken);

    setCookie(c, ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    setCookie(c, REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json(sendSuccess(null, "Токены успешно обновлены"));
  } catch (error) {
    return c.json(sendError("Ошибка при обновлении токенов"), 401);
  }
});

auth.post("/logout", async (c) => {
  setCookie(c, ACCESS_TOKEN_COOKIE, "", { maxAge: 0 });
  setCookie(c, REFRESH_TOKEN_COOKIE, "", { maxAge: 0 });
  return c.json(sendSuccess(null, "Успешный выход"));
});

auth.get("/me", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const currentUser = await getCurrentUser(user.id);
    return c.json(sendSuccess(currentUser, "Данные пользователя получены"));
  } catch (error) {
    return c.json(sendError("Ошибка при получении данных пользователя"), 500);
  }
});
