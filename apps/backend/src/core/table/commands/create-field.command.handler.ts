import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { TableSpecHandler, type ITableRepository } from '@undb/core'
import { CreateFieldCommand, CreateFieldCommandHandler as DomainHandler } from '@undb/cqrs'
import { type IUnitOfWork } from '@undb/domain'
import { InjectUnitOfWork } from '../../../uow/uow.service.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(CreateFieldCommand)
export class CreateFieldCommandHandler extends DomainHandler implements ICommandHandler<CreateFieldCommand, void> {
  constructor(
    @InjectUnitOfWork()
    protected readonly uow: IUnitOfWork,
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    protected readonly handler: TableSpecHandler,
  ) {
    super(uow, tableRepo, handler)
  }
}
