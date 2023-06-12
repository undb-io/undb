import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { ExportGridCommandHandler as DomainHandler, ExportGridCommand } from '@undb/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/index.js'
import { CSVExportor } from '../exportor/csv.exportor.js'

@CommandHandler(ExportGridCommand)
export class ExportGridCommandHandler extends DomainHandler implements ICommandHandler<ExportGridCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
    protected readonly exportor: CSVExportor,
  ) {
    super(tableRepo, recordRepo, exportor)
  }
}
