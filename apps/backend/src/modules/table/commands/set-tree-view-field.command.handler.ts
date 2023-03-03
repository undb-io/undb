import { type ITableRepository } from '@egodb/core'
import { SetTreeViewFieldCommand, SetTreeViewFieldCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetTreeViewFieldCommand)
export class SetTreeViewFieldCommandHandler extends DomainHandler implements ICommandHandler<SetTreeViewFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
