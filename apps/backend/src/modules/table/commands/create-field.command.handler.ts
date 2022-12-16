import type { CreateFieldCommand } from '@egodb/core'
import { CreateFieldCommandHandler as DomainHandler, ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

export class CreateFieldCommandHandler extends DomainHandler implements ICommandHandler<CreateFieldCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
