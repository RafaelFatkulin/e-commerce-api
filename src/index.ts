import { Hono } from 'hono'
import { serveStatic } from "hono/bun";

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use('/static/*', serveStatic({root: './'}))

export default {
  port: 8000,
  fetch: app.fetch
}
