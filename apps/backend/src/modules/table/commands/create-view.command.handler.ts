import { ITableRepository } from '@egodb/core'
import { CreateViewCommand, CreateViewCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(CreateViewCommand)
export class CreateViewCommandHandler extends DomainHandler implements ICommandHandler<CreateViewCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
