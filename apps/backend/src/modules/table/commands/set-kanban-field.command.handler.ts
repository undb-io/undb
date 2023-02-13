import { ITableRepository } from '@egodb/core'
import { SetKanbanFieldCommand, SetKanbanFieldCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetKanbanFieldCommand)
export class SetKanbanFieldCommandHandler extends DomainHandler implements ICommandHandler<SetKanbanFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
