import { ITableRepository } from '@egodb/core'
import { EditTableCommand, EditTableCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(EditTableCommand)
export class EditTableCommandHandler extends DomainHandler implements ICommandHandler<EditTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
