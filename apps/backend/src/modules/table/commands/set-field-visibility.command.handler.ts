import {
  ITableRepository,
  SetFieldVisibilityCommand,
  SetFieldVisibilityCommandHandler as DomainHandelr,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/in-memory'

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
