import { ITableRepository } from '@egodb/core'
import { MoveViewCommand, MoveViewCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(MoveViewCommand)
export class MoveViewCommandHandler extends DomainHandler implements ICommandHandler<MoveViewCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
