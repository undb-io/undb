import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsStore, TableSpecHandler, type IRecordRepository, type ITableRepository } from '@undb/core'
import { CreateTableCommand, CreateTableCommandHandler as DomainHandler } from '@undb/cqrs'
import { type IUnitOfWork } from '@undb/domain'
import { ClsService } from 'nestjs-cls'
import { InjectUnitOfWork } from '../../../uow/uow.service.js'
import { InjectRecordRepository, InjectTableRepository } from '../adapters/index.js'

@CommandHandler(CreateTableCommand)
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
    super(uow, repo, recordRepo, handler, cls)
  }
}
