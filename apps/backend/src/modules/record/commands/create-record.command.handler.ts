import { CreateRecordCommand, CreateRecordCommandHandler as DomainHandler, IRecordRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory } from '../adapters'

@CommandHandler(CreateRecordCommand)
export class CreateRecordCommandHandler extends DomainHandler implements ICommandHandler<CreateRecordCommand> {
  constructor(
    @InjectRecordReposiory()
    protected readonly repo: IRecordRepository,
  ) {
    super(repo)
  }
}
