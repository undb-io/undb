import { type ITableRepository } from '@egodb/core'
import { UpdateViewNameCommand, UpdateViewNameCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(UpdateViewNameCommand)
export class UpdateViewNameCommandHandler
  extends DomainHandler
  implements ICommandHandler<UpdateViewNameCommand, void>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
