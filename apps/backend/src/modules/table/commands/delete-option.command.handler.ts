import { DeleteOptionCommand, DeleteOptionCommandHandler as DomainHandler, ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(DeleteOptionCommand)
export class DeleteOptionCommandHandler extends DomainHandler implements ICommandHandler<DeleteOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly OptionRepo: ITableRepository,
  ) {
    super(OptionRepo)
  }
}
