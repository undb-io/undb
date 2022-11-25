import { swaggerServe } from '@egodb/trpc'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { Logger, Module, RequestMethod } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { providers } from './providers'
import { TrpcOpenApiMiddleware } from './trpc-open-api.middleware'
import { TrpcSwaggerUISetupMiddleware } from './trpc-swagger-ui-setup.middleware'
import { TrpcMiddleware } from './trpc.middleware'

@Module({
  imports: [CqrsModule],
  providers,
})
export class TrpcModule implements NestModule {
  static TRPC_ENDPOINT = '/api/trpc'
  static TRPC_OPEN_API_ENDPOINT = '/api'
  static TRPC_API_DOCS_ENDPOINT = '/api-docs'

  static logger = new Logger(TrpcModule.name)

  configure(consumer: MiddlewareConsumer) {
    {
      consumer.apply(TrpcMiddleware).forRoutes(TrpcModule.TRPC_ENDPOINT)
      TrpcModule.logger.debug('Mounting Trpc middleware to ' + TrpcModule.TRPC_ENDPOINT)
    }
    {
      consumer.apply(TrpcOpenApiMiddleware).forRoutes(TrpcModule.TRPC_OPEN_API_ENDPOINT)
      TrpcModule.logger.debug('Mounting TrpcOpenApi middleware to ' + TrpcModule.TRPC_OPEN_API_ENDPOINT)
    }
    {
      consumer.apply(...swaggerServe).forRoutes(TrpcModule.TRPC_API_DOCS_ENDPOINT)
      consumer
        .apply(TrpcSwaggerUISetupMiddleware)
        .forRoutes({ path: TrpcModule.TRPC_API_DOCS_ENDPOINT, method: RequestMethod.GET })
      TrpcModule.logger.debug('Mounting TrpcSwaggerUI middleware to ' + TrpcModule.TRPC_API_DOCS_ENDPOINT)
    }
  }
}
