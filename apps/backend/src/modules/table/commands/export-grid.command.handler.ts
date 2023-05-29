import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import { ExportGridCommandHandler as DomainHandler, ExportGridCommand } from '@undb/cqrs'
import { InjectRecordQueryModel, InjectTableReposiory } from '../adapters/index.js'
import { CSVExportor } from '../exportor/csv.exportor.js'

@CommandHandler(ExportGridCommand)
export class ExportGridCommandHandler extends DomainHandler implements ICommandHandler<ExportGridCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
    protected readonly exportor: CSVExportor,
  ) {
    super(tableRepo, rm, exportor)
  }
}
