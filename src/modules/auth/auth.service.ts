import { sign, verify as jwtVerify } from "hono/jwt";
import { hash, verify as hashVerify } from "@utils/hash";
import { LoginData, RegisterData } from "./auth.type";
import {
  createUser,
  getUserByEmail,
  getUserById,
  UserRole,
} from "@modules/users";

const generateTokens = async (
  userId: number,
  email: string,
  role: UserRole
) => {
  const accessToken = await sign(
    {
      id: userId,
      email: email,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 минут
    },
    Bun.env.JWT_SECRET!
  );

  const refreshToken = await sign(
    {
      id: userId,
      email: email,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 дней
    },
    Bun.env.JWT_REFRESH_SECRET!
  );

  return { accessToken, refreshToken };
};

export const login = async (data: LoginData) => {
  const user = await getUserByEmail(data.email);
  const isValidPassword = await hashVerify(data.password, user.password);

  if (!isValidPassword) {
    throw new Error("Неверный пароль");
  }

  const tokens = await generateTokens(user.id, user.email, user.role);

  return {
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
    },
  };
};

export const register = async (data: RegisterData) => {
  const hashedPassword = await hash(data.password);
  const user = await createUser({ ...data, password: hashedPassword });
  const tokens = await generateTokens(user.id, user.email, user.role);

  return {
    ...tokens,
    user,
  };
};

export const refreshTokens = async (refreshToken: string) => {
  const payload = (await jwtVerify(
    refreshToken,
    Bun.env.JWT_REFRESH_SECRET!
  )) as { id: number; email: string };
  const user = await getUserById(payload.id);

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  return await generateTokens(user.id, user.email, user.role);
};

export const getCurrentUser = async (userId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  return user;
};
