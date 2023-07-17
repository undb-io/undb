import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetSortsCommandHandler as DomainHandler, SetSortsCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetSortsCommand)
export class SetSortsCommandHandler extends DomainHandler implements ICommandHandler<SetSortsCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
