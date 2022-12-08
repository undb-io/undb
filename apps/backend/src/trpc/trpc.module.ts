import { swaggerServe } from '@egodb/trpc'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { Logger, Module, RequestMethod } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { providers } from './providers'
import { TrpcOpenApiMiddleware } from './trpc-open-api.middleware'
import { TrpcSwaggerUISetupMiddleware } from './trpc-swagger-ui-setup.middleware'
import { TRPC_API_DOCS_ENDPOINT, TRPC_ENDPOINT, TRPC_OPEN_API_ENDPOINT } from './trpc.constants'
import { TrpcMiddleware } from './trpc.middleware'

@Module({
  imports: [CqrsModule],
  providers,
})
export class TrpcModule implements NestModule {
  static logger = new Logger(TrpcModule.name)

  configure(consumer: MiddlewareConsumer) {
    {
      consumer.apply(TrpcMiddleware).forRoutes(TRPC_ENDPOINT)
      TrpcModule.logger.log('Mounting Trpc middleware to ' + TRPC_ENDPOINT)
    }
    {
      consumer.apply(TrpcOpenApiMiddleware).forRoutes(TRPC_OPEN_API_ENDPOINT)
      TrpcModule.logger.log('Mounting TrpcOpenApi middleware to ' + TRPC_OPEN_API_ENDPOINT)
    }
    {
      consumer.apply(...swaggerServe).forRoutes(TRPC_API_DOCS_ENDPOINT)
      consumer
        .apply(TrpcSwaggerUISetupMiddleware)
        .forRoutes({ path: TRPC_API_DOCS_ENDPOINT, method: RequestMethod.GET })
      TrpcModule.logger.log('Mounting TrpcSwaggerUI middleware to ' + TRPC_API_DOCS_ENDPOINT)
    }
  }
}
