import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import * as trpcExpress from '@trpc/server/adapters/express'
import { AppRouter } from '@undb/trpc'
import compression from 'compression'
import { Request } from 'express'
import helmet from 'helmet'
import { ClsMiddleware, ClsService } from 'nestjs-cls'
import { Logger } from 'nestjs-pino'
import passport from 'passport'
import { v4 } from 'uuid'
import { AppModule } from './app.module.js'
import { JwtStrategy } from './auth/jwt.strategy.js'
import { AllExceptionsFilter } from './filters/http-exception.filter.js'
import { i18nMiddleware } from './i18n/i18n.middleware.js'
import { I18NEXT } from './i18n/i18next.provider.js'
import { AppRouterSymbol } from './trpc/providers/app-router.js'
import { TRPC_ENDPOINT } from './trpc/trpc.constants.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  app.useLogger(app.get(Logger))

  app.enableCors()
  app.enableShutdownHooks()
  app.setGlobalPrefix('/api', { exclude: ['health'] })

  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost))

  const router = app.get<AppRouter>(AppRouterSymbol)
  const jwt = app.get(JwtStrategy)
  const i18next = app.get(I18NEXT)
  const cls = app.get(ClsService)

  app
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
        middleware: passport.authenticate(jwt, { session: false }),
      }),
    )
    .use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }))
    .use(compression())

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
