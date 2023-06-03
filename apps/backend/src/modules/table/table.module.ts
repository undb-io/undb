import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { exportors } from './exportor/index.js'
import { queryHandlers } from './queries/index.js'
import { RecordController } from './record.controller.js'
import { tableSpecHandler } from './services/table-spec.handler.js'

@Module({
  controllers: [RecordController],
  imports: [CqrsModule],
  providers: [...commandHandlers, ...queryHandlers, ...dbAdapters, tableSpecHandler, ...exportors],
})
export class TableModule {}
