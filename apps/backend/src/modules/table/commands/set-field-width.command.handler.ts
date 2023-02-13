import { ITableRepository } from '@egodb/core'
import { SetFieldWidthCommand, SetFieldWidthCommandHandler as DomainHandelr } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetFieldWidthCommand)
export class SetFieldWidthCommandHandler extends DomainHandelr implements ICommandHandler<SetFieldWidthCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
