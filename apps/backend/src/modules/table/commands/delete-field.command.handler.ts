import { ITableRepository } from '@egodb/core'
import { DeleteFieldCommand, DeleteFieldCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(DeleteFieldCommand)
export class DeleteFieldCommandHandler extends DomainHandler implements ICommandHandler<DeleteFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
