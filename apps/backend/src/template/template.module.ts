import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { commandHandlers } from './commands/index.js'
import { TemplateController } from './template.controller.js'
import { NestTemplateService } from './template.service.js'

@Module({
  imports: [TableAdapterModule, CqrsModule],
  controllers: [TemplateController],
  providers: [NestTemplateService, ...commandHandlers],
})
export class TemplateModule {}
