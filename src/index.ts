import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { showRoutes } from "hono/dev";
import { users } from "@/modules/users";
import { auth } from "@/modules/auth";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);
app.route("/users", users);

app.use("/static/*", serveStatic({ root: "./" }));

showRoutes(app, {
  verbose: true,
  colorize: true,
});

export default {
  port: 8000,
  fetch: app.fetch,
};
