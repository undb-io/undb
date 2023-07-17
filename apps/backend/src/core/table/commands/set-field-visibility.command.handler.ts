import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFieldVisibilityCommandHandler as DomainHandler, SetFieldVisibilityCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetFieldVisibilityCommand)
export class SetFieldVisibilityCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetFieldVisibilityCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
