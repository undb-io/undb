import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetGanttFieldCommandHandler as DomainHandler, SetGanttFieldCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetGanttFieldCommand)
export class SetGanttFieldCommandHandler extends DomainHandler implements ICommandHandler<SetGanttFieldCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
