import { type ITableRepository } from '@egodb/core'
import { UpdateFieldCommand, UpdateFieldCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
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
