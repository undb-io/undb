import { EditTableCommand, EditTableCommandHandler as DomainHandler, ITableRepository } from '@egodb/core'
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
