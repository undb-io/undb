import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateFieldCommandHandler as DomainHandler, UpdateFieldCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(UpdateFieldCommand)
export class UpdateFieldCommandHandler extends DomainHandler implements ICommandHandler<UpdateFieldCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
