import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetRowHeightCommandHandler as DomainHandelr, SetRowHeightCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetRowHeightCommand)
export class SetRowHeightCommandHandler extends DomainHandelr implements ICommandHandler<SetRowHeightCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
