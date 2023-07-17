import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFormFieldRequirementsCommandHandler as DomainHandler, SetFormFieldRequirementsCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetFormFieldRequirementsCommand)
export class SetFormFieldRequirementsCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetFormFieldRequirementsCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
