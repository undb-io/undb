import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...dbAdapters, ...queries, ...commands],
})
export class BaseModule {}
