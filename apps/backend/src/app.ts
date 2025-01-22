import "core-js"
import "reflect-metadata"

import { register } from "./registry"
register()

import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import staticPlugin from "@elysiajs/static"
import { swagger } from "@elysiajs/swagger"
import { trpc } from "@elysiajs/trpc"
import { executionContext } from "@undb/context/server"
import { container } from "@undb/di"
import { env } from "@undb/env"
import { Graphql } from "@undb/graphql"
import { createLogger } from "@undb/logger"
import { dbMigrate } from "@undb/persistence/server"
import { PubSubContext } from "@undb/realtime"
import { IRecordEvent } from "@undb/table"
import { route } from "@undb/trpc"
import { WebhookEventsHandler } from "@undb/webhook"
import { Elysia } from "elysia"
import { all } from "radash"
import { v4 } from "uuid"
import * as pkg from "../../../package.json"
import { Auth, OpenAPI, Realtime, SpaceModule, TableModule, Web } from "./modules"
import { FileService } from "./modules/file/file"
import { OpenTelemetryModule } from "./modules/opentelemetry/opentelemetry.module"
import { TemplateModule } from "./modules/template/template.module"
import { loggerPlugin } from "./plugins/logging"

const auth = container.resolve(Auth)
const web = container.resolve(Web)
const openapi = container.resolve(OpenAPI)
const opentelemetry = container.resolve(OpenTelemetryModule)
const template = container.resolve(TemplateModule)

const logger = createLogger("app")

export const app = new Elysia()
  .on("start", async () => {
    logger.info("db migrate start")
    await dbMigrate()
    logger.info("db migrate done")
    await auth.onStart()

    const pubsub = container.resolve(PubSubContext)
    const webhookEventHandler = container.resolve(WebhookEventsHandler)
    // const auditEventHandler = container.resolve(AuditEventHandler)
    const messages = pubsub.subscribe("tenant.*.record.*")
    for await (const message of messages) {
      const event = message as IRecordEvent
      const operatorId = event.operatorId!
      const spaceId = event.spaceId

      // TODO: request id
      executionContext.enterWith({
        requestId: "",
        user: { userId: operatorId },
        spaceId,
      })
      try {
        await all([
          //
          webhookEventHandler.handle(event),
          // auditEventHandler.handle(event),
        ])
      } catch (error) {
        logger.error(error)
      }
    }
  })
  .use(opentelemetry.plugin())
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
  .use(
    staticPlugin({
      assets: "./.undb/storage",
      prefix: "/public",
    }),
  )
  .onRequest((ctx) => {
    const requestId = ctx.request.headers.get("x-request-id") ?? v4()

    executionContext.enterWith({
      requestId,
    })
  })
  .use(cors())
  .use(html())
  .use(
    swagger({
      path: "/openapi",
      excludeStaticFile: false,
      // exclude: new RegExp(/^(?!.*\/api\/bases).*/),
      documentation: {
        info: {
          title: "Undb OpenAPI Documentation",
          version: pkg.version,
        },

        tags: [
          { name: "Record", description: "Record operations" },
          { name: "Doc", description: "OpenAPI documentation" },
        ],
      },
    }),
  )
  .derive(auth.store())
  .onError((ctx) => {
    ctx.logger.error(ctx.error)
  })
  .get("/healthy", () => {
    return { status: "ok" }
  })
  .use(auth.route())
  .use(web.route())
  .use(openapi.route())
  .use(template.route())
  .use(trpc(route))
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
        if (env.UNDB_VERIFY_EMAIL && !user.emailVerified && user.email) {
          return context.redirect(`/verify-email?redirect=${context.path}`, 301)
        }
      },
    },
    (app) => {
      const realtime = container.resolve(Realtime)
      const graphql = container.resolve(Graphql)
      const file = container.resolve(FileService)
      const table = container.resolve(TableModule)
      const space = container.resolve(SpaceModule)

      return (
        app
          //
          .use(space.route())
          .use(file.route())
          .use(graphql.route())
          .use(realtime.route())
          .use(table.route())
      )
    },
  )

export type App = typeof app
