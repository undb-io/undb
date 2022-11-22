import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters'
import { commandHandlers } from './commands'

@Module({
  imports: [CqrsModule],
  providers: [...commandHandlers, ...dbAdapters],
})
export class TableModule {}
