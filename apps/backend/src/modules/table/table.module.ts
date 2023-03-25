import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { queryHandlers } from './queries/index.js'
import { tableSpecHandler } from './services/table-spec.handler.js'

@Module({
  imports: [CqrsModule],
  providers: [...commandHandlers, ...queryHandlers, ...dbAdapters, tableSpecHandler],
})
export class TableModule {}
