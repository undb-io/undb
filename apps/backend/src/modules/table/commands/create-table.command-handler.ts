import { CreateTableCommand, CreateTableCommandHandler as DomainHandler } from '@egodb/core'
import { ITableRepository } from '@egodb/core/repository'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(CreateTableCommand)
export class CreateTableCommandHandler extends DomainHandler implements ICommandHandler<CreateTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
