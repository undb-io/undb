import tracer from './tracer.js'

import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import * as trpcExpress from '@trpc/server/adapters/express'
import type { AppRouter } from '@undb/trpc'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import type { Request } from 'express'
import helmet from 'helmet'
import type { i18n } from 'i18next'
import { ClsMiddleware, ClsService } from 'nestjs-cls'
import { Logger } from 'nestjs-pino'
import { v4 } from 'uuid'
import { AppModule } from './app.module.js'
import { AllExceptionsFilter } from './filters/http-exception.filter.js'
import { i18nMiddleware } from './i18n/i18n.middleware.js'
import { I18NEXT } from './i18n/i18next.provider.js'
import { configureOpenAPISwagger } from './openapi/swagger.js'
import { AppRouterSymbol } from './trpc/providers/app-router.js'
import { TRPC_CONTEXT } from './trpc/providers/context.js'
import { TRPC_ENDPOINT } from './trpc/trpc.constants.js'

export async function bootstrap() {
  await tracer.start()

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const port = parseInt(process.env.UNDB_BACKEND_PORT ?? '4000', 10)

  const logger = app.get(Logger)
  app.useLogger(logger)

  app.enableCors()
  app.enableShutdownHooks()
  app.enableVersioning()
  app.setGlobalPrefix('/api', { exclude: ['health'] })

  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger))

  const router = app.get<AppRouter>(AppRouterSymbol)
  const createContext = app.get(TRPC_CONTEXT)
  const i18next: i18n = app.get(I18NEXT)
  const cls = app.get(ClsService)

  configureOpenAPISwagger(app)

  app
    .use(cookieParser())
    .use(
      new ClsMiddleware({
        generateId: true,
        idGenerator: (req: Request) => (req.headers['X-Request-Id'] as string) ?? v4(),
      }).use,
    )
    .use(i18nMiddleware(cls, i18next))
    .use(
      TRPC_ENDPOINT,
      trpcExpress.createExpressMiddleware({
        router,
        createContext,
      }),
    )
    .use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        referrerPolicy: {
          policy: ['origin', 'same-origin'],
        },
      }),
    )
    .use(compression())

  await app.listen(port, '0.0.0.0')

  logger.log(`Undb started at port ${port}`)

  process.on('uncaughtException', (error) => {
    logger.error(error)
  })

  return app
}

if (process.env.APP_ENV !== 'desktop') {
  bootstrap()
}
