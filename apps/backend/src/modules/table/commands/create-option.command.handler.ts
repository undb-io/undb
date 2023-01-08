import { CreateOptionCommand, CreateOptionCommandHandler as DomainHandler, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(CreateOptionCommand)
export class CreateOptionCommandHandler extends DomainHandler implements ICommandHandler<CreateOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
