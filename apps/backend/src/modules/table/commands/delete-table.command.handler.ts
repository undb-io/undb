import { ITableRepository } from '@egodb/core'
import { DeleteTableCommand, DeleteTableCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(DeleteTableCommand)
export class DeleteTableCommandHandler extends DomainHandler implements ICommandHandler<DeleteTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
