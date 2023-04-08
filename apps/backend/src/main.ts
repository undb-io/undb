import { AppRouter } from '@egodb/trpc'
import { NestFactory } from '@nestjs/core'
import * as trpcExpress from '@trpc/server/adapters/express'
import compression from 'compression'
import helmet from 'helmet'
import { Logger } from 'nestjs-pino'
import passport from 'passport'
import { AppModule } from './app.module.js'
import { JwtStrategy } from './auth/jwt.strategy.js'
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

  const router = app.get<AppRouter>(AppRouterSymbol)
  const jwt = app.get(JwtStrategy)
  app
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
