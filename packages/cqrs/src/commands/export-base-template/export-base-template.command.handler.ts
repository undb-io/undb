import type { ICommandHandler } from '@undb/domain'
import type { ITemplateService, Template } from '@undb/template'
import type { Option } from 'oxide.ts'
import type { ExportBaseTemplateCommand } from './export-base-template.command.js'

export class ExportBaseTemplateCommandHandler implements ICommandHandler<ExportBaseTemplateCommand, Option<Template>> {
  constructor(protected readonly svc: ITemplateService) {}

  async execute(command: ExportBaseTemplateCommand): Promise<Option<Template>> {
    return this.svc.fromBase(command.baseId)
  }
}
