import { type ITableRepository } from '@egodb/core'
import { SetFieldVisibilityCommand, SetFieldVisibilityCommandHandler as DomainHandelr } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
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
