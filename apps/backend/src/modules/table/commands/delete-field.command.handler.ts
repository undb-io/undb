import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { DeleteFieldCommand, DeleteFieldCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(DeleteFieldCommand)
export class DeleteFieldCommandHandler extends DomainHandler implements ICommandHandler<DeleteFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
