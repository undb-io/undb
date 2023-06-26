import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { ExportGridCommandHandler as DomainHandler, ExportGridCommand } from '@undb/cqrs'
import { InjectRecordRepository, InjectTableRepository } from '../adapters/index.js'
import { NestRecordExportorService } from '../exportor/exportor.service.js'

@CommandHandler(ExportGridCommand)
export class ExportGridCommandHandler extends DomainHandler implements ICommandHandler<ExportGridCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
    protected readonly service: NestRecordExportorService,
  ) {
    super(tableRepo, recordRepo, service)
  }
}
