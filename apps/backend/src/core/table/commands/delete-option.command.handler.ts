import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { DeleteOptionCommand, DeleteOptionCommandHandler as DomainHandler } from '@undb/cqrs'
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
