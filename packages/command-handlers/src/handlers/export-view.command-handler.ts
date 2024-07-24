import { ExportViewCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, TableDo, type IReadableRecordDTO, type ITableService } from "@undb/table"

@commandHandler(ExportViewCommand)
@singleton()
export class ExportViewCommandHandler implements ICommandHandler<ExportViewCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: ExportViewCommand): Promise<{ table: TableDo; records: IReadableRecordDTO[] }> {
    return this.service.exportView(command.tableId, { viewId: command.viewId })
  }
}
