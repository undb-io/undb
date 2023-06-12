import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFieldVisibilityCommandHandler as DomainHandelr, SetFieldVisibilityCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetFieldVisibilityCommand)
export class SetFieldVisibilityCommandHandler
  extends DomainHandelr
  implements ICommandHandler<SetFieldVisibilityCommand, void>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
