import type { AppRouteHandler } from "types";
import type {
  ProfileRoute,
  RefreshTokenRoute,
  SigninRoute,
  SignoutRoute,
  SignupRoute,
  UpdateProfileRoute,
} from "./auth.routes";
import {
  createUser,
  getUser,
  getUserByEmail,
  updateUser,
} from "@modules/user/user.service";
import { createErrorResponse, createSuccessResponse } from "@utils/response";
import { HttpStatusCodes } from "@utils/status-codes";
import {
  createRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
} from "./auth.services";
import { generateTokens } from "./auth.utils";

const signup: AppRouteHandler<SignupRoute> = async (c) => {
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

  const [user] = await createUser({
    ...data,
    role: "admin",
  });

  if (!user) {
    return c.json(
      createErrorResponse({ message: "Произошла ошибка при регистрации" }),
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const { at, rt, rtExpiresAt, atExpiresAt } = await generateTokens(
    user.id,
    user.role
  );

  await createRefreshToken({
    token: rt,
    userId: user.id,
    expiresAt: rtExpiresAt,
  });

  return c.json(
    createSuccessResponse({
      message: "Успешная регистрация",
      data: {
        accessToken: at,
        refreshToken: rt,
        accessExpiresAt: atExpiresAt,
        refreshExpiresAt: rtExpiresAt,
      },
    }),
    201
  );
};

const signin: AppRouteHandler<SigninRoute> = async (c) => {
  const { email, password } = c.req.valid("json");
  const incorrectMessage = "Неверные данные, попробуйте еще раз";

  const user = await getUserByEmail(email);

  if (!user) {
    return c.json(
      createErrorResponse({ message: incorrectMessage }),
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const isValidPassword = await Bun.password.verify(
    password,
    user.password,
    "bcrypt"
  );

  if (!isValidPassword) {
    return c.json(
      createErrorResponse({ message: incorrectMessage }),
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const { at, rt, atExpiresAt, rtExpiresAt } = await generateTokens(
    user.id,
    user.role
  );

  await createRefreshToken({
    token: rt,
    userId: user.id,
    expiresAt: rtExpiresAt,
  });

  return c.json(
    createSuccessResponse({
      message: "Добро пожаловать",
      data: {
        accessToken: at,
        refreshToken: rt,
        accessExpiresAt: atExpiresAt,
        refreshExpiresAt: rtExpiresAt,
        user,
      },
    }),
    200
  );
};

const signout: AppRouteHandler<SignoutRoute> = async (c) => {
  const { refreshToken } = c.req.valid("json");

  if (!refreshToken) {
    return c.json(
      createErrorResponse({ message: "Отсутствует токен" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingToken = await getRefreshToken(refreshToken);

  if (!existingToken || existingToken.revoked) {
    return c.json(
      createErrorResponse({ message: "Токена нет в базе" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  await revokeRefreshToken(existingToken.id);

  return c.json(
    createSuccessResponse({
      message: "Вы вышли из аккаунта",
      data: null,
    }),
    200
  );
};

const refresh: AppRouteHandler<RefreshTokenRoute> = async (c) => {
  const { refreshToken } = c.req.valid("json");

  if (!refreshToken) {
    return c.json(
      createErrorResponse({ message: "Недействительный токен" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingRefreshToken = await getRefreshToken(refreshToken, false);

  if (!existingRefreshToken) {
    return c.json(
      createErrorResponse({ message: "Недействительный токен" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const user = await getUser(existingRefreshToken.userId!);

  if (!user) {
    return c.json(
      createErrorResponse({ message: "Недействительный токен" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const {
    at,
    rt: newRefreshToken,
    rtExpiresAt,
    atExpiresAt,
  } = await generateTokens(user.id, user.role);

  await revokeRefreshToken(existingRefreshToken.id);

  await createRefreshToken({
    token: newRefreshToken,
    userId: user.id,
    expiresAt: rtExpiresAt,
  });

  return c.json(
    createSuccessResponse({
      data: {
        accessToken: at,
        refreshToken: newRefreshToken,
        accessExpiresAt: atExpiresAt,
        refreshExpiresAt: rtExpiresAt,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone ? user.phone : undefined,
          role: user.role,
        },
      },
    }),
    200
  );
};

const profile: AppRouteHandler<ProfileRoute> = async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      createErrorResponse({ message: "Пользователь не найден" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  return c.json(createSuccessResponse({ data: user }), 200);
};

const updateProfile: AppRouteHandler<UpdateProfileRoute> = async (c) => {
  const data = c.req.valid("json");
  const user = c.get("user");

  if (!user) {
    return c.json(
      createErrorResponse({ message: "Пользователь не найден" }),
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    const [updatedUser] = await updateUser(user.id, data);

    return c.json(
      createSuccessResponse({
        message: `Информация аккаунта обновлена`,
        data: updatedUser,
      }),
      HttpStatusCodes.OK
    );
  } catch {
    return c.json(
      createErrorResponse({
        message: "Ошибка при редактировании аккаунта",
      }),
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

export const handlers = {
  signup,
  signin,
  signout,
  refresh,
  profile,
  updateProfile,
};
