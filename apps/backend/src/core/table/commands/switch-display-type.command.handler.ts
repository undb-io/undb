import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SwitchDisplayTypeCommandHandler as DomainHandler, SwitchDisplayTypeCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SwitchDisplayTypeCommand)
export class SwitchDisplayTypeCommandHandler
  extends DomainHandler
  implements ICommandHandler<SwitchDisplayTypeCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
