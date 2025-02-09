import type { User } from "@modules/user/user.type";
import { sign } from "hono/jwt";

export async function generateTokens(id: number, role: User["role"]) {
  const at = await sign(
    {
      id,
      role,
      exp: Math.floor(Date.now() / 1000) * 60 * 15,
    },
    Bun.env.AT_SECRET!
  );

  const rt = await sign(
    {
      id,
      role,
      exp: Math.floor(Date.now() / 1000) * 7 * 24 * 60 * 60,
    },
    Bun.env.RT_SECRET!
  );

  const atExpiresAt = new Date(Date.now() + 60 * 15 * 1000);
  const rtExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return {
    at,
    rt,
    atExpiresAt,
    rtExpiresAt,
  };
}
