import {
  SetKanbanFieldCommand,
  SetKanbanFieldCommandHandler as DomainHandler,
  type ITableRepository,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/in-memory'

@CommandHandler(SetKanbanFieldCommand)
export class SetKanbanFieldCommandHandler extends DomainHandler implements ICommandHandler<SetKanbanFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
