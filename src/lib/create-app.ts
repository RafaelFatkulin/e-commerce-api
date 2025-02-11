import type { AppBindings } from "./types";
import { logger } from "@helpers/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createErrorResponse } from "@utils/response";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        console.log(result);
        
        return c.json(
          createErrorResponse({
            errors: result.error.format(),
          }),
          422
        );
      }
    },
  });
}

export function createApp() {
  const app = createRouter();

  app.use(
    "*",
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );
  app.use(logger());

  app.notFound((c) => {
    return c.json(
      createErrorResponse({ message: `Не найдено ${c.req.path}` }),
      404
    );
  });

  app.onError((err, c) => {
    console.log(err);
    
    if (err instanceof HTTPException) {
      const status = err.getResponse().status;

      if (status === 401) {
        return c.json(createErrorResponse({ message: "Unauthorized" }), status);
      }

      if (status === 403) {
        return c.json(
          createErrorResponse({ message: "Недостаточно прав для действия" }),
          status
        );
      }

      if (status === 404) {
        return c.json(createErrorResponse({ message: err.message }), status);
      }
    }

    return c.json(createErrorResponse({ message: err.message }), 500);
  });

  return app;
}
