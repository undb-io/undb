import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFormFieldVisibilityCommandHandler as DomainHandler, SetFormFieldVisibilityCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetFormFieldVisibilityCommand)
export class SetFormFieldVisibilityCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetFormFieldVisibilityCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
