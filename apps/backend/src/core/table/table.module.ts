import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { OutboxModule } from '../../outbox/outbox.module.js'
import { RealtimeModule } from '../../realtime/realtime.module.js'
import { UnitOfWorkModule } from '../../uow/uow.module.js'
import { dbAdapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { queryHandlers } from './queries/index.js'
import { RecordController } from './record.controller.js'
import { tableSpecHandler } from './services/table-spec.handler.js'
import { TableController } from './table.controller.js'

@Module({
  controllers: [RecordController, TableController],
  imports: [CqrsModule, OutboxModule, RealtimeModule, UnitOfWorkModule],
  providers: [...commandHandlers, ...queryHandlers, ...dbAdapters, tableSpecHandler],
  exports: [...dbAdapters],
})
export class TableModule {}
