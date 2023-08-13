import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRLSRepository } from '@undb/authz'
import { type ITableRepository } from '@undb/core'
import { CreateRLSCommand, CreateRLSCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectRLSRepository } from '../adapters/rls-sqlite.repository.js'

@CommandHandler(CreateRLSCommand)
export class CreateRLSCommandHandler extends DomainHandler implements ICommandHandler<CreateRLSCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRLSRepository()
    protected readonly repo: IRLSRepository,
  ) {
    super(tableRepo, repo)
  }
}
