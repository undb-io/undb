import { type ITableRepository } from '@egodb/core'
import { DuplicateViewCommand, DuplicateViewCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
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
