import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IFLSRepository } from '@undb/authz'
import { type ITableRepository } from '@undb/core'
import { CreateFLSCommand, CreateFLSCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectFLSRepository } from '../adapters/fls-sqlite.repository.js'

@CommandHandler(CreateFLSCommand)
export class CreateFLSCommandHandler extends DomainHandler implements ICommandHandler<CreateFLSCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectFLSRepository()
    protected readonly repo: IFLSRepository,
  ) {
    super(tableRepo, repo)
  }
}
