import { type ITableRepository } from '@egodb/core'
import { SetPinnedFieldsCommand, SetPinnedFieldsCommandHandler as DomainHandelr } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetPinnedFieldsCommand)
export class SetPinnedFieldsCommandHandler
  extends DomainHandelr
  implements ICommandHandler<SetPinnedFieldsCommand, void>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
