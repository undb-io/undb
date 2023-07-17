import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { RelayoutWidgetsCommandHandler as DomainHandler, RelayoutWidgetsCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(RelayoutWidgetsCommand)
export class RelayoutWidgetsCommandHandler extends DomainHandler implements ICommandHandler<RelayoutWidgetsCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
