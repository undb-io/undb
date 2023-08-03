import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { RLSModule } from '../authz/rls/rls.module.js'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { queries } from './queries/index.js'
import { services } from './services/index.js'

@Module({
  imports: [CqrsModule, TableAdapterModule, RLSModule],
  providers: [...adapters, ...commands, ...queries, ...services],
})
export class ShareModule {}
