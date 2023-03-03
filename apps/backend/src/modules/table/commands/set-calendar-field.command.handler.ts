import { type ITableRepository } from '@egodb/core'
import { SetCalendarFieldCommand, SetCalendarFieldCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SetCalendarFieldCommand)
export class SetCalendarFieldCommandHandler extends DomainHandler implements ICommandHandler<SetCalendarFieldCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
