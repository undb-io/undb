import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetTreeViewFieldCommandHandler as DomainHandler, SetTreeViewFieldCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetTreeViewFieldCommand)
export class SetTreeViewFieldCommandHandler extends DomainHandler implements ICommandHandler<SetTreeViewFieldCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
