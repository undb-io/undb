import "core-js"
import "reflect-metadata"

import { register } from "./registry"
register()

import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import staticPlugin from "@elysiajs/static"
import { swagger } from "@elysiajs/swagger"
import { trpc } from "@elysiajs/trpc"
import { AuditEventHandler } from "@undb/audit"
import { executionContext } from "@undb/context/server"
import { container } from "@undb/di"
import { Graphql } from "@undb/graphql"
import { PubSubContext } from "@undb/realtime"
import { IRecordEvent } from "@undb/table"
import { route } from "@undb/trpc"
import { WebhookEventsHandler } from "@undb/webhook"
import { Elysia } from "elysia"
import { all } from "radash"
import { v4 } from "uuid"
import { Auth, OpenAPI, Realtime, Web } from "./modules"
import { FileService } from "./modules/file/file"
import { loggerPlugin } from "./plugins/logging"

const auth = container.resolve(Auth)
const web = container.resolve(Web)

export const app = new Elysia()
  .trace(async ({ handle, set }) => {
    const { time, end } = await handle

    set.headers["Server-Timing"] = `handle;dur=${(await end) - time}`
  })
  .onStart(async () => {
    const pubsub = container.resolve(PubSubContext)
    const webhookEventHandler = container.resolve(WebhookEventsHandler)
    const auditEventHandler = container.resolve(AuditEventHandler)
    const messages = pubsub.subscribe("tenant.*.record.*")
    for await (const message of messages) {
      const event = message as IRecordEvent
      const operatorId = event.operatorId!

      // TODO: request id
      executionContext.enterWith({ requestId: "", user: { userId: operatorId } })
      await all([
        //
        webhookEventHandler.handle(event),
        auditEventHandler.handle(event),
      ])
    }
  })
  .use(
    staticPlugin({
      assets: "./.undb/storage",
      prefix: "/public",
    }),
  )
  .use(cors())
  .use(html())
  .use(swagger())
  .derive(auth.store())
  .onBeforeHandle((ctx) => {
    const requestId = ctx.headers["X-Request-ID"] ?? v4()

    executionContext.enterWith({
      requestId,
      user: { userId: ctx.user?.id ?? null },
      member: { role: ctx.member?.role ?? null } ?? null,
    })
  })
  .use(auth.route())
  .use(loggerPlugin())
  .use(web.route())
  .guard(
    {
      beforeHandle(context) {
        if (context.path === "/graphql") {
          return
        }
        const user = context.user
        if (!user) {
          return context.redirect(`/signup?redirect=${context.path}`, 301)
        }
      },
    },
    (app) => {
      const openapi = container.resolve(OpenAPI)
      const realtime = container.resolve(Realtime)
      const graphql = container.resolve(Graphql)
      const file = container.resolve(FileService)
      return (
        app
          //
          .use(trpc(route))
          .use(file.route())
          .use(graphql.route())
          .use(openapi.route())
          .use(realtime.route())
      )
    },
  )

export type App = typeof app

export type Hello = "wt"
