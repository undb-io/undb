import "core-js"
import "reflect-metadata"

import { register } from "./registry"
register()

import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import { trpc } from "@elysiajs/trpc"
import { executionContext } from "@undb/context/server"
import { container } from "@undb/di"
import { graphql } from "@undb/graphql"
import { route } from "@undb/trpc"
import { Elysia } from "elysia"
import { requestID } from "elysia-requestid"
import { loggerPlugin } from "./plugins/logging"
import { auth, authStore } from "./routes/auth.route"
import { OpenAPI } from "./routes/openapi.route"
import { web } from "./routes/web.route"

const app = new Elysia()
  .trace(async ({ handle, set }) => {
    const { time, end } = await handle

    set.headers["Server-Timing"] = `handle;dur=${(await end) - time}`
  })
  .use(cors())
  .use(html())
  .derive(authStore)
  .use(requestID())
  .onBeforeHandle((ctx) => {
    const requestId = ctx.set.headers["X-Request-ID"]
    executionContext.enterWith({ requestId, user: { userId: ctx.user?.id ?? null } })
  })
  .use(auth())
  .use(loggerPlugin())
  .guard(
    {
      beforeHandle(context) {
        const user = context.user
        if (!user) {
          return context.redirect("/signup", 301)
        }
      },
    },
    (app) => {
      const openapi = container.resolve(OpenAPI)
      return app.use(trpc(route)).use(graphql().yoga).use(web()).use(openapi.route())
    },
  )

export type App = typeof app

app.listen(Bun.env.PORT ?? 4000, () => {
  app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
})
