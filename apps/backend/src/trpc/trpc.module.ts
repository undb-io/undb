import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { Logger, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { providers } from './providers/index.js'
import { TRPC_ENDPOINT } from './trpc.constants.js'
import { TrpcMiddleware } from './trpc.middleware.js'

@Module({
  imports: [CqrsModule],
  providers,
})
export class TrpcModule implements NestModule {
  static logger = new Logger('TrpcModule')

  configure(consumer: MiddlewareConsumer) {
    {
      consumer.apply(TrpcMiddleware).forRoutes(TRPC_ENDPOINT)
      TrpcModule.logger.log('Mounting Trpc middleware to ' + TRPC_ENDPOINT)
    }
  }
}
