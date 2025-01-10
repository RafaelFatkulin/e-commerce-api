import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { user } from "./user";

class Note {
  constructor(public data: string[] = ["Moonhalo", "Doonhalo"]) {}
}

const app = new Elysia()
  .use(swagger())
  .decorate("note", new Note())
  .use(user)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
