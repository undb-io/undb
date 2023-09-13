import type { ClsStore, IClsService, ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { TemplateFactory } from '@undb/template/dist/index.js'
import type { ImportTemplateCommand } from './import-template.command.js'

export class ImportTemplateCommandHandler implements ICommandHandler<ImportTemplateCommand, void> {
  constructor(
    protected readonly repo: ITableRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: ImportTemplateCommand): Promise<void> {
    const template = TemplateFactory.fromJSON(command.template)

    const tables = template.export.toTables(this.cls.get())

    await this.repo.insertMany(tables)
  }
}
