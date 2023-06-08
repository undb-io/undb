import type { IRecordExportor, IRecordRepository } from '@undb/core'
import { WithRecordTableId, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { ExportGridCommand } from './export-grid.comand.js'

export class ExportGridCommandHandler implements ICommandHandler<ExportGridCommand, string> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly exportor: IRecordExportor,
  ) {}

  async execute(command: ExportGridCommand): Promise<string> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const filter = table.getSpec(command.viewId)

    const spec = WithRecordTableId.fromString(command.tableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    const records = await this.recordRepo.find(table.id.value, spec, table.schema.toIdMap())

    return this.exportor.export(table, command.viewId, records)
  }
}
