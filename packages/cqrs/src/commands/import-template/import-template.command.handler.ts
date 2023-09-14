import type { ClsStore, IClsService, ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { TemplateFactory } from '@undb/template'
import type { ImportTemplateCommand } from './import-template.command.js'

export class ImportTemplateCommandHandler implements ICommandHandler<ImportTemplateCommand, void> {
  constructor(
    protected readonly repo: ITableRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: ImportTemplateCommand): Promise<void> {
    const ctx = this.cls.get()

    const template = TemplateFactory.fromJSON(command.template)
    const tables = template.export.toTables(ctx)

    await this.repo.insertMany(tables)
  }
}
