import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import { users } from "@/modules/users";
import { auth } from "@/modules/auth";
import { categories } from "@modules/categories";

export const app = new Hono();

app.use(csrf({ origin: ["*"] }));
app.use(logger());

app.route("/auth", auth);
app.route("/users", users);
app.route("/categories", categories);

app.use("/static/*", serveStatic({ root: "./" }));

export default {
  port: Bun.env.PORT!,
  fetch: app.fetch,
};
