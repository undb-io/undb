import type { IRecordRepository } from '@undb/core'
import { type ClsStore, type IClsService, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { TemplateFactory } from '@undb/template'
import type { ImportTemplateCommand } from './import-template.command.js'

export class ImportTemplateCommandHandler implements ICommandHandler<ImportTemplateCommand, void> {
  constructor(
    protected readonly repo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: ImportTemplateCommand): Promise<void> {
    const userId = this.cls.get('user.userId')

    const template = TemplateFactory.fromJSON(command.template)
    const tables = template.export.toTables(userId)

    await Promise.all(
      tables.map(async ({ table, records }) => {
        await this.repo.insert(table)
        if (records && command.includeRecords) {
          await this.recordRepo.insertMany(table, records)
        }
      }),
    )
  }
}
