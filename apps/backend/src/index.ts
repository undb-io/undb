import "core-js"
import "reflect-metadata"

import { register } from "./registry"
register()

import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import { staticPlugin } from "@elysiajs/static"
import { trpc } from "@elysiajs/trpc"
import { executionContext } from "@undb/context/server"
import { graphql } from "@undb/graphql"
import { route } from "@undb/trpc"
import { Elysia } from "elysia"
import { requestID } from "elysia-requestid"
import { loggerPlugin } from "./plugins/logging"
import { auth, authStore } from "./routes/auth.route"
import { web } from "./routes/web.route"

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({ indexHTML: true, prefix: "/", assets: "dist" }))
  .use(html())
  .derive(authStore)
  .use(requestID())
  .onBeforeHandle((ctx) => {
    const requestId = ctx.set.headers["X-Request-ID"]
    executionContext.enterWith({ requestId, user: { userId: "123" } })
  })
  .use(auth())
  .use(loggerPlugin())
  .use(trpc(route))
  .use(graphql().yoga)
  .use(web())

export type App = typeof app

app.listen(Bun.env.PORT ?? 4000, () => {
  app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
})
