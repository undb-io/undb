import { type ITableRepository } from '@egodb/core'
import { SetSortsCommand, SetSortsCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetSortsCommand)
export class SetSortsCommandHandler extends DomainHandler implements ICommandHandler<SetSortsCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
