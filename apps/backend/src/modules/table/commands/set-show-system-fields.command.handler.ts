import { ITableRepository } from '@egodb/core'
import { SetShowSystemFieldsCommand, SetShowSystemFieldsCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetShowSystemFieldsCommand)
export class SetShowSystemFieldsCommandHandler
  extends DomainHandler
  implements ICommandHandler<SetShowSystemFieldsCommand>
{
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
