import type { AppBindings } from "./types";
import { logger } from "@helpers/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createErrorResponse } from "@utils/response";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { ZodError } from "zod";

function formatZodErrors(error: ZodError) {
  return error.errors.map((err) => {
    const fieldPath = err.path.length > 0 ? err.path.join(".") : "unknown field";

    let message: string;
    switch (err.code) {
      case "invalid_type":
        message = `Поле "${fieldPath}" имеет неверный тип данных. Ожидается ${err.expected}, получено ${err.received}.`;
        break;
      case "too_small":
        message = `Поле "${fieldPath}" слишком короткое. Минимальная длина: ${err.minimum}.`;
        break;
      case "too_big":
        message = `Поле "${fieldPath}" слишком длинное. Максимальная длина: ${err.maximum}.`;
        break;
      case "invalid_string":
        if ('validation' in err) {
          switch (err.validation) {
            case "email":
              message = `Поле "${fieldPath}" должен быть действительным email-адресом.`;
              break;
            case "uuid":
              message = `Поле "${fieldPath}" должен быть корректным UUID.`;
              break;
            default:
              message = `Поле "${fieldPath}" не соответствует требуемому формату.`;
          }
        } else {
          message = `Поле "${fieldPath}" содержит недопустимое значение.`;
        }
        break;
      case "invalid_enum_value":
        message = `Поле "${fieldPath}" должен быть одним из: ${err.options.join(", ")}.`;
        break;
      default:
        message = `Поле "${fieldPath}:" ${err.message}`;
    }

    return {
      field: fieldPath,
      message,
    };
  });
}

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        console.log(result);

        const formattedErrors = formatZodErrors(result.error);

        return c.json(
          createErrorResponse({
            message: "Ошибка валидации данных",
            errors: formattedErrors,
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
