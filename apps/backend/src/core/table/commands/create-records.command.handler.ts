import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { CreateRecordsCommand, CreateRecordsCommandHandler as DomainHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordRepository } from '../adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(CreateRecordsCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class CreateRecordsCommandHandler extends DomainHandler implements ICommandHandler<CreateRecordsCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(tableRepo, recordRepo, cls as IClsService<ClsStore>)
  }
}
