import { ITableRepository } from '@egodb/core'
import { SetFiltersCommandHandler as DomainHandler, SetFitlersCommand } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetFitlersCommand)
export class SetFiltersCommandHandler extends DomainHandler implements ICommandHandler<SetFitlersCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
