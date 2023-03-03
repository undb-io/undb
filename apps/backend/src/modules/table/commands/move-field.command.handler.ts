import { type ITableRepository } from '@egodb/core'
import { MoveFieldCommand, MoveFieldCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(MoveFieldCommand)
export class MoveFieldCommandHandler extends DomainHandler implements ICommandHandler<MoveFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
