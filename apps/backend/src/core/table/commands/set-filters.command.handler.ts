import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFiltersCommandHandler as DomainHandler, SetFitlersCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetFitlersCommand)
export class SetFiltersCommandHandler extends DomainHandler implements ICommandHandler<SetFitlersCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
