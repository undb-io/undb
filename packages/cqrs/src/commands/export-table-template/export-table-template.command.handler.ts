import type { ICommandHandler } from '@undb/domain'
import type { ITemplateService, Template } from '@undb/template'
import type { Option } from 'oxide.ts'
import type { ExportTableTemplateCommand } from './export-table-template.command.js'

export class ExportTableTemplateCommandHandler
  implements ICommandHandler<ExportTableTemplateCommand, Option<Template>>
{
  constructor(protected readonly svc: ITemplateService) {}

  async execute(command: ExportTableTemplateCommand): Promise<Option<Template>> {
    return this.svc.fromTable(command.tableId, command.recordIds)
  }
}
