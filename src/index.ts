import { createErrorResponse } from "@modules/core/helpers";
import { user } from "@modules/user";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/users", user);
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    console.log({ err });

    const status = err.getResponse().status;
    console.log(status);

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
export default app;
