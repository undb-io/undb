import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { RelayoutWidgesCommandHandler as DomainHandler, RelayoutWidgesCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(RelayoutWidgesCommand)
export class RelayoutWidgesCommandHandler extends DomainHandler implements ICommandHandler<RelayoutWidgesCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
