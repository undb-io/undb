import { CreateFieldCommand, CreateFieldCommandHandler as DomainHandler, ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/in-memory'

@CommandHandler(CreateFieldCommand)
export class CreateFieldCommandHandler extends DomainHandler implements ICommandHandler<CreateFieldCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
