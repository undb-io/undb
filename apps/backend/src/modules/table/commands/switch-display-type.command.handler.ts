import { ITableRepository } from '@egodb/core'
import { SwitchDisplayTypeCommand, SwitchDisplayTypeCommandHandler as DomainHandelr } from '@egodb/cqrs'
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
