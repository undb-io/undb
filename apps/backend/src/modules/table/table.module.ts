import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters'
import { commandHandlers } from './commands'
import { queryHandlers } from './queries'

@Module({
  imports: [CqrsModule],
  providers: [...commandHandlers, ...queryHandlers, ...dbAdapters],
})
export class TableModule {}
