import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { DuplicateFieldCommandHandler as DomainHandler, DuplicateFieldCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(DuplicateFieldCommand)
export class DuplicateFieldCommandHandler extends DomainHandler implements ICommandHandler<DuplicateFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
