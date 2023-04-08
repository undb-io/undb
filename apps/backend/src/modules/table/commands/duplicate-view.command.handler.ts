import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { DuplicateViewCommandHandler as DomainHandler, DuplicateViewCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(DuplicateViewCommand)
export class DuplicateViewCommandHandler extends DomainHandler implements ICommandHandler<DuplicateViewCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
