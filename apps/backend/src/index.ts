import "core-js"
import "reflect-metadata"

import { register } from "./registry"
register()

import { staticPlugin } from "@elysiajs/static"
import { executionContext } from "@undb/context/server"
import { Elysia } from "elysia"
import { requestID } from "elysia-requestid"
import { loggerPlugin } from "./plugins/logging"
import { authStore } from "./routes/auth.route"

const app = new Elysia()
  // .use(cors())
  .use(staticPlugin({ prefix: "/", assets: "dist" }))
  // .use(html())
  .derive(authStore)
  .use(requestID())
  .onBeforeHandle((ctx) => {
    const requestId = ctx.set.headers["X-Request-ID"]
    executionContext.enterWith({ requestId, user: { userId: ctx.user?.id ?? null } })
  })
  // .use(auth())
  .use(loggerPlugin())
  // .use(trpc(route))
  // .use(graphql().yoga)
  .get("/", () => {
    throw new Error("Server is during maintenance")

    return "unreachable"
  })

export type App = typeof app

app.listen(Bun.env.PORT ?? 4000, () => {
  app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
})
