import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FLSModule } from '../../authz/fls/fls.module.js'
import { RLSModule } from '../../authz/rls/rls.module.js'
import { CacheModule } from '../../cache/cache.module.js'
import { OutboxModule } from '../../outbox/outbox.module.js'
import { RealtimeModule } from '../../realtime/realtime.module.js'
import { UnitOfWorkModule } from '../../uow/uow.module.js'
import { dbAdapters } from './adapters/index.js'
import { TableAdapterModule } from './adapters/table-adapter.module.js'
import { commandHandlers } from './commands/index.js'
import { queryHandlers } from './queries/index.js'
import { tableSpecHandler } from './services/table-spec.handler.js'
import { TableController } from './table.controller.js'

@Module({
  imports: [
    CqrsModule,
    CacheModule,
    RealtimeModule,
    UnitOfWorkModule,
    OutboxModule,
    TableAdapterModule,
    RLSModule,
    FLSModule,
  ],
  controllers: [TableController],
  providers: [...commandHandlers, ...queryHandlers, ...dbAdapters, tableSpecHandler],
})
export class TableModule {}
