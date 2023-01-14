import { UpdateOptionCommand, UpdateOptionCommandHandler as DomainHandler, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(UpdateOptionCommand)
export class UpdateOptionCommandHandler extends DomainHandler implements ICommandHandler<UpdateOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
