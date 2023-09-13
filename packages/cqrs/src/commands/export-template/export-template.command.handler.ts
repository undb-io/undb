import type { ICommandHandler } from '@undb/domain'
import type { ITemplateService, Template } from '@undb/template'
import type { Option } from 'oxide.ts'
import type { ExportTemplateCommand } from './export-template.command.js'

export class ExportTemplateCommandHandler implements ICommandHandler<ExportTemplateCommand, Option<Template>> {
  constructor(protected readonly svc: ITemplateService) {}

  async execute(command: ExportTemplateCommand): Promise<Option<Template>> {
    return this.svc.fromTable(command.tableId)
  }
}
