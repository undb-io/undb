import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetPinnedFieldsCommandHandler as DomainHandelr, SetPinnedFieldsCommand } from '@undb/cqrs'
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
