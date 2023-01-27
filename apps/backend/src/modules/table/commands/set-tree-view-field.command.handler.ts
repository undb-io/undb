import {
  SetTreeViewFieldCommand,
  SetTreeViewFieldCommandHandler as DomainHandler,
  type ITableRepository,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetTreeViewFieldCommand)
export class SetTreeViewFieldCommandHandler extends DomainHandler implements ICommandHandler<SetTreeViewFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
