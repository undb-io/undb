import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { commandHandlers } from './commands/index.js'
import { NestTemplateService } from './template.service.js'

@Module({
  imports: [TableAdapterModule, CqrsModule],
  providers: [NestTemplateService, ...commandHandlers],
})
export class TemplateModule {}
