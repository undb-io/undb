import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetFieldWidthCommandHandler as DomainHandelr, SetFieldWidthCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetFieldWidthCommand)
export class SetFieldWidthCommandHandler extends DomainHandelr implements ICommandHandler<SetFieldWidthCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
