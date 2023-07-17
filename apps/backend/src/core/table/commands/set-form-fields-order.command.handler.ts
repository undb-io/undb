import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFormFieldsOrderCommandHandler as DomainHandler, SetFormFieldsOrderCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetFormFieldsOrderCommand)
export class SetFormFieldsOrderCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetFormFieldsOrderCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
