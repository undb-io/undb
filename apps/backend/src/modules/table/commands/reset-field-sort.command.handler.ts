import { type ITableRepository } from '@egodb/core'
import { ResetFieldSortCommand, ResetFieldSortCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(ResetFieldSortCommand)
export class ResetFieldSortCommandHandler extends DomainHandler implements ICommandHandler<ResetFieldSortCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
