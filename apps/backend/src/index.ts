import "core-js"
import "reflect-metadata"

import { register } from "./registry"

import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import { staticPlugin } from "@elysiajs/static"
import { trpc } from "@elysiajs/trpc"
import { route } from "@undb/trpc"
import { Elysia } from "elysia"
import { requestID } from "elysia-requestid"
import { loggerPlugin } from "./plugins/logging"
import { executionContext } from "@undb/context/server"

const app = new Elysia()
  .onStart(() => {
    register()
  })
  .use(requestID())
  .onRequest(({ set }) => {
    const requestId = set.headers["X-Request-ID"]
    // TODO: remove test user
    executionContext.enterWith({ requestId, user: { userId: "test" } })
  })
  .use(staticPlugin({ prefix: "/", assets: "dist" }))
  .use(cors())
  .use(html())
  .use(loggerPlugin())
  .use(trpc(route))

export type App = typeof app

app.listen(Bun.env.PORT ?? 4000, () => {
  app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
})
