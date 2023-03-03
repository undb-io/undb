import { type ITableRepository } from '@egodb/core'
import { UpdateTableCommand, UpdateTableCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(UpdateTableCommand)
export class UpdateTableCommandHandler extends DomainHandler implements ICommandHandler<UpdateTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
