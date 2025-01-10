import Elysia from "elysia";
import { database } from "../database";
import { table } from "../database/schemas";

export const user = new Elysia({ prefix: "users" })
  .use(database)
  .get("/", async ({ db }) => await db().select().from(table.user));
