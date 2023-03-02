import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))

  app.enableCors()
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.enableShutdownHooks()

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  await app.listen(4000)
}
bootstrap()
