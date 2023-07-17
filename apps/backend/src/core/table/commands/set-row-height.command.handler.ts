import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetRowHeightCommandHandler as DomainHandler, SetRowHeightCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetRowHeightCommand)
export class SetRowHeightCommandHandler extends DomainHandler implements ICommandHandler<SetRowHeightCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
