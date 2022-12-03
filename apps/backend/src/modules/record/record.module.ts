import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters'
import { commands } from './commands'

@Module({
  imports: [CqrsModule],
  providers: [...commands, ...dbAdapters],
})
export class RecordModule {}
