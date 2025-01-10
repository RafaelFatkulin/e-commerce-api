import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import Elysia from "elysia";

const db = drizzle(process.env.DATABASE_URL!);

export const database = new Elysia({
  name: "database",
}).decorate("db", () => db);
