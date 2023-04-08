import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetShowSystemFieldsCommandHandler as DomainHandler, SetShowSystemFieldsCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

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
