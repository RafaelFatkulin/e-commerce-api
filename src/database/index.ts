import "dotenv/config";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import Elysia from "elysia";

const db = drizzle(process.env.DATABASE_URL!);

export type DatabaseClient = () => NodePgDatabase<Record<string, never>> & {
  $client: NodePgClient;
};

export const database = new Elysia({
  name: "database",
}).decorate("db", () => db);
