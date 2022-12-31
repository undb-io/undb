import { ITableRepository, ReorderOptionsCommand, ReorderOptionsCommandHandler as DomainHandler } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(ReorderOptionsCommand)
export class ReorderOptionsCommandHandler extends DomainHandler implements ICommandHandler<ReorderOptionsCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
