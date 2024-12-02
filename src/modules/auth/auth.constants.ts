export const AUTH_COOKIE_OPTIONS = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "Strict" as const,
} as const;

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
