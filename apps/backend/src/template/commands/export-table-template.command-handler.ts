import { CommandHandler } from '@nestjs/cqrs'
import { ExportTableTemplateCommand, ExportTableTemplateCommandHandler } from '@undb/cqrs'
import { NestTemplateService } from '../template.service.js'

@CommandHandler(ExportTableTemplateCommand)
export class NestExportTableTemplateCommandHandler extends ExportTableTemplateCommandHandler {
  constructor(svc: NestTemplateService) {
    super(svc)
  }
}
