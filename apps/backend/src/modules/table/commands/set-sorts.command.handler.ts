import { SetSortsCommand, SetSortsCommandHandler as DomainHandler, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetSortsCommand)
export class SetSortsCommandHandler extends DomainHandler implements ICommandHandler<SetSortsCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
