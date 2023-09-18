import { CommandHandler } from '@nestjs/cqrs'
import { ExportTemplateCommand, ExportTemplateCommandHandler } from '@undb/cqrs'
import { NestTemplateService } from '../template.service.js'

@CommandHandler(ExportTemplateCommand)
export class NestExportTemplateCommandHandler extends ExportTemplateCommandHandler {
  constructor(svc: NestTemplateService) {
    super(svc)
  }
}
