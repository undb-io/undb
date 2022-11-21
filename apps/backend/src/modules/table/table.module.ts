import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters'
import { commandHandlers } from './commands'
import { restfulControllers } from './ports/restful'
import { TableTrpcMiddleware } from './ports/trpc/table-trpc.middleware'

@Module({
  imports: [CqrsModule],
  controllers: [...restfulControllers],
  providers: [...commandHandlers, ...dbAdapters],
})
export class TableModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TableTrpcMiddleware).forRoutes('/trpc')
  }
}
