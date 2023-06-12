import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateOptionCommandHandler as DomainHandler, UpdateOptionCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(UpdateOptionCommand)
export class UpdateOptionCommandHandler extends DomainHandler implements ICommandHandler<UpdateOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
