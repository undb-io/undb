import {
  ITableRepository,
  SwitchDisplayTypeCommand,
  SwitchDisplayTypeCommandHandler as DomainHandelr,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SwitchDisplayTypeCommand)
export class SwitchDisplayTypeCommandHandler
  extends DomainHandelr
  implements ICommandHandler<SwitchDisplayTypeCommand, void>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
