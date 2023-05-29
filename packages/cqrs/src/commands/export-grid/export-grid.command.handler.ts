import { IRecordExportor, IRecordQueryModel, ViewId, WithRecordTableId, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { ExportGridCommand } from './export-grid.comand.js'

export class ExportGridCommandHandler implements ICommandHandler<ExportGridCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly exportor: IRecordExportor,
  ) {}

  async execute(command: ExportGridCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const filter = table.getSpec(command.viewId)

    let spec = WithRecordTableId.fromString(command.tableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    const viewId = ViewId.fromString(command.viewId)
    const records = await this.rm.find(table.id.value, viewId, spec)

    return this.exportor.export({})
  }
}
