import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFormFieldFilterCommandHandler as DomainHandler, SetFormFieldFilterCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetFormFieldFilterCommand)
export class SetFormFieldFilterCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetFormFieldFilterCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
