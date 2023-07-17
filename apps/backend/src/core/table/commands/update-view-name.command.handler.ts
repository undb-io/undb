import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateViewNameCommandHandler as DomainHandler, UpdateViewNameCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(UpdateViewNameCommand)
export class UpdateViewNameCommandHandler
  extends DomainHandler
  implements ICommandHandler<UpdateViewNameCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
