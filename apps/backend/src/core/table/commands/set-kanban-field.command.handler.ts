import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetKanbanFieldCommandHandler as DomainHandler, SetKanbanFieldCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(SetKanbanFieldCommand)
export class SetKanbanFieldCommandHandler extends DomainHandler implements ICommandHandler<SetKanbanFieldCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
