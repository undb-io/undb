import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository, type IRecordExportor } from '@undb/core'
import { ExportGridCommandHandler as DomainHandler, ExportGridCommand } from '@undb/cqrs'
import {
  InjectRecordRepository,
  InjectTableRepository,
  InjectRecordCSVExportor,
  InjectRecordExcelExportor,
} from '../adapters/index.js'

@CommandHandler(ExportGridCommand)
export class ExportGridCommandHandler extends DomainHandler implements ICommandHandler<ExportGridCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
    @InjectRecordCSVExportor()
    protected readonly csvExportor: IRecordExportor,
    @InjectRecordExcelExportor()
    protected readonly excelExportor: IRecordExportor,
  ) {
    super(tableRepo, recordRepo, csvExportor, excelExportor)
  }
}
