import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetPinnedFieldsCommandHandler as DomainHandler, SetPinnedFieldsCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetPinnedFieldsCommand)
export class SetPinnedFieldsCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetPinnedFieldsCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
