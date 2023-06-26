import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableModule } from '../core/table/table.module.js'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule, TableModule],
  providers: [...adapters, ...commands, ...queries],
})
export class ShareModule {}
