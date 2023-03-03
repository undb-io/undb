import { type ITableRepository } from '@egodb/core'
import { CreateOptionCommand, CreateOptionCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(CreateOptionCommand)
export class CreateOptionCommandHandler extends DomainHandler implements ICommandHandler<CreateOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
