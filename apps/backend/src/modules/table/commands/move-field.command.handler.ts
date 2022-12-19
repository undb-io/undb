import { MoveFieldCommand, MoveFieldCommandHandler as DomainHandler, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(MoveFieldCommand)
export class MoveFieldCommandHandler extends DomainHandler implements ICommandHandler<MoveFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
