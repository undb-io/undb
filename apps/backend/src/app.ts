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
import { createLogger } from "@undb/logger"
import { PubSubContext } from "@undb/realtime"
import { IRecordEvent } from "@undb/table"
import { route } from "@undb/trpc"
import { WebhookEventsHandler } from "@undb/webhook"
import { Elysia } from "elysia"
import { all } from "radash"
import { v4 } from "uuid"
import { SPACE_ID_COOKIE_NAME } from "./constants"
import { Auth, OpenAPI, Realtime, TableModule, Web } from "./modules"
import { FileService } from "./modules/file/file"
import { loggerPlugin } from "./plugins/logging"

const auth = container.resolve(Auth)
const web = container.resolve(Web)
const openapi = container.resolve(OpenAPI)

export const app = new Elysia()
  // .use(
  //   opentelemetry({
  //     spanProcessors: [
  //       new BatchSpanProcessor(
  //         new OTLPTraceExporter({
  //           url: "https://api.axiom.co/v1/traces",
  //           headers: {
  //             Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`,
  //             "X-Axiom-Dataset": Bun.env.AXIOM_DATASET,
  //           },
  //         }),
  //       ),
  //     ],
  //   }),
  // )
  .use(loggerPlugin())
  .onError((ctx) => {
    if (ctx.code === "NOT_FOUND") {
      ctx.set.status = 404
      ctx.logger.error(
        {
          error: ctx.error,
          path: ctx.path,
          headers: ctx.headers,
        },
        "Not Found",
      )

      return "Not Found :("
    }

    return new Response(ctx.error.toString())
  })
  .trace(async ({ set, onHandle }) => {
    const { begin, end } = await onHandle()

    set.headers["Server-Timing"] = `handle;dur=${(await end) - begin}`
  })
  .onStart(async () => {
    const logger = createLogger("app onstart")
    const pubsub = container.resolve(PubSubContext)
    const webhookEventHandler = container.resolve(WebhookEventsHandler)
    const auditEventHandler = container.resolve(AuditEventHandler)
    const messages = pubsub.subscribe("tenant.*.record.*")
    for await (const message of messages) {
      const event = message as IRecordEvent
      const operatorId = event.operatorId!

      // TODO: request id
      executionContext.enterWith({ requestId: "", user: { userId: operatorId } })
      try {
        await all([
          //
          webhookEventHandler.handle(event),
          auditEventHandler.handle(event),
        ])
      } catch (error) {
        logger.error(error)
      }
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
  .onError((ctx) => {
    ctx.logger.error(ctx.error)
  })
  .onBeforeHandle((ctx) => {
    const requestId = ctx.headers["X-Request-ID"] ?? v4()
    const spaceId = ctx.headers[SPACE_ID_COOKIE_NAME] ?? null

    executionContext.enterWith({
      requestId,
      user: { userId: ctx.user?.id ?? null, email: ctx.user?.email, username: ctx.user?.username },
      member: { role: ctx.member?.role ?? null, spaceId: ctx.member?.spaceId ?? null } ?? null,
    })
  })
  .get("/healthy", () => {
    return { status: "ok" }
  })
  .use(auth.route())
  .use(web.route())
  .use(openapi.route())
  .guard(
    {
      beforeHandle(context) {
        if (context.path === "/graphql") {
          return
        }
        const user = context.user
        if (!user) {
          return context.redirect(`/login?redirect=${context.path}`, 301)
        }
      },
    },
    (app) => {
      const realtime = container.resolve(Realtime)
      const graphql = container.resolve(Graphql)
      const file = container.resolve(FileService)
      const table = container.resolve(TableModule)

      return (
        app
          //
          .use(trpc(route))
          .use(file.route())
          .use(graphql.route())
          .use(realtime.route())
          .use(table.route())
      )
    },
  )

export type App = typeof app

export type Hello = "wt"
