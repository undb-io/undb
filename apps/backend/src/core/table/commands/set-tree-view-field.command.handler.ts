import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetTreeViewFieldCommandHandler as DomainHandler, SetTreeViewFieldCommand } from '@undb/cqrs'
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
