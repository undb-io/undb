import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetCalendarFieldCommandHandler as DomainHandler, SetCalendarFieldCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetCalendarFieldCommand)
export class SetCalendarFieldCommandHandler extends DomainHandler implements ICommandHandler<SetCalendarFieldCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
