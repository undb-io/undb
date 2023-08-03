import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { TableSpecHandler, type IRecordRepository, type ITableRepository } from '@undb/core'
import { CreateTableCommand, CreateTableCommandHandler as DomainHandler } from '@undb/cqrs'
import { type IUnitOfWork } from '@undb/domain'
import { ClsService } from 'nestjs-cls'
import { InjectUnitOfWork } from '../../../uow/uow.service.js'
import { InjectRecordRepository } from '../adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(CreateTableCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class CreateTableCommandHandler extends DomainHandler implements ICommandHandler<CreateTableCommand> {
  constructor(
    @InjectUnitOfWork()
    protected readonly uow: IUnitOfWork,
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
    protected readonly handler: TableSpecHandler,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(uow, repo, recordRepo, handler, cls as IClsService<ClsStore>)
  }
}
