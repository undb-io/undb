import { ITableRepository } from '@egodb/core'
import { DeleteViewCommand, DeleteViewCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(DeleteViewCommand)
export class DeleteViewCommandHandler extends DomainHandler implements ICommandHandler<DeleteViewCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
