import { createErrorResponse } from "./response";
import { z } from "zod";
import { Context, Env } from "hono";

export const validateJsonSchema = (
  result: (
    | {
        success: true;
        data: any;
      }
    | {
        success: false;
        error: z.ZodError;
        data: any;
      }
  ) & {
    target: "json";
  },
  c: Context<Env, string, {}>
) => {
  if (!result.success) {
    return c.json(createErrorResponse({ errors: result.error.format() }), 400);
  }
};
