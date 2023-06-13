import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository, type IRecordExportor } from '@undb/core'
import { ExportGridCommandHandler as DomainHandler, ExportGridCommand } from '@undb/cqrs'
import { InjectRecordReposiory, InjectTableReposiory, InjectRecordExportor } from '../adapters/index.js'

@CommandHandler(ExportGridCommand)
export class ExportGridCommandHandler extends DomainHandler implements ICommandHandler<ExportGridCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
    @InjectRecordExportor()
    protected readonly exportor: IRecordExportor,
  ) {
    super(tableRepo, recordRepo, exportor)
  }
}
