import { CommandHandler } from '@nestjs/cqrs'
import { ExportBaseTemplateCommand, ExportBaseTemplateCommandHandler } from '@undb/cqrs'
import { NestTemplateService } from '../template.service.js'

@CommandHandler(ExportBaseTemplateCommand)
export class NestExportBaseTemplateCommandHandler extends ExportBaseTemplateCommandHandler {
  constructor(svc: NestTemplateService) {
    super(svc)
  }
}
