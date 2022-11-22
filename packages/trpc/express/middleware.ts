import { inferAsyncReturnType } from '@trpc/server'
import { OpenAPIV3 } from 'openapi-types'

import * as trpcExpress from '@trpc/server/adapters/express'
import swaggerUi from 'swagger-ui-express'

import { type Handler, type RequestHandler } from 'express'
import { createOpenApiExpressMiddleware, generateOpenApiDocument } from 'trpc-openapi'
import { AppRouter } from '../router/router'

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({}) // no context
type Context = inferAsyncReturnType<typeof createContext>

export const createExpressMiddleware = (appRouter: AppRouter): Handler => {
  return trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
}

export const createOpenApiMiddlware = (appRouter: AppRouter): Handler =>
  createOpenApiExpressMiddleware({ router: appRouter })

export type AppOpenApiDocument = ReturnType<typeof createOpenApiDocument>

export const createOpenApiDocument = (appRouter: AppRouter): OpenAPIV3.Document =>
  generateOpenApiDocument(appRouter, {
    title: 'tRPC OpenAPI',
    version: '1.0.0',
    baseUrl: 'http://localhost:4000/api/trpc',
  })

export const swaggerServe: RequestHandler[] = swaggerUi.serve

export const createSwaggerUISetup = (openApiDocument: OpenAPIV3.Document): RequestHandler =>
  swaggerUi.setup(openApiDocument)
