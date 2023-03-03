import { type ITableRepository } from '@egodb/core'
import { DeleteOptionCommand, DeleteOptionCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(DeleteOptionCommand)
export class DeleteOptionCommandHandler extends DomainHandler implements ICommandHandler<DeleteOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly OptionRepo: ITableRepository,
  ) {
    super(OptionRepo)
  }
}
