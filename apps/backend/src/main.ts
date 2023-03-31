import { AppRouter } from '@egodb/trpc'
import { NestFactory } from '@nestjs/core'
import * as trpcExpress from '@trpc/server/adapters/express'
import compression from 'compression'
import helmet from 'helmet'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module.js'
import { AppRouterSymbol } from './trpc/providers/app-router.js'
import { TRPC_ENDPOINT } from './trpc/trpc.constants.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  app.useLogger(app.get(Logger))

  app.enableCors()
  app.enableShutdownHooks()

  const router = app.get<AppRouter>(AppRouterSymbol)
  app
    .use(
      TRPC_ENDPOINT,
      trpcExpress.createExpressMiddleware({
        router,
      }),
    )
    .use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }))
    .use(compression())

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
