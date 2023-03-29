import { AppRouter } from '@egodb/trpc'
import compression from '@fastify/compress'
import multipart from '@fastify/multipart'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module.js'
import { AppRouterSymbol } from './trpc/providers/app-router.js'
import { TRPC_ENDPOINT } from './trpc/trpc.constants.js'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ maxParamLength: 5000 }),
    {
      bufferLogs: true,
    },
  )
  app.useLogger(app.get(Logger))

  app.enableCors()
  app.enableShutdownHooks()

  const router = app.get<AppRouter>(AppRouterSymbol)
  await app.register(fastifyTRPCPlugin, {
    prefix: TRPC_ENDPOINT,
    trpcOptions: { router },
  })

  await app.register(compression)
  await app.register(multipart)

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
