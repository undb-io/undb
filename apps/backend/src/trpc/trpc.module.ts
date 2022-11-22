import { swaggerServe } from '@egodb/trpc'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrpcMiddleware).forRoutes('/api/trpc')
    consumer.apply(TrpcOpenApiMiddleware).forRoutes('/api')
    consumer.apply(...swaggerServe).forRoutes('/api-docs')
    consumer.apply(TrpcSwaggerUISetupMiddleware).forRoutes({ path: '/api-docs', method: RequestMethod.GET })
  }
}
