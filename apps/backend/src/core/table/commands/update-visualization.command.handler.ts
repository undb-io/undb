import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateVisualizationCommandHandler as DomainHandler, UpdateVisualizationCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(UpdateVisualizationCommand)
export class UpdateVisualizationCommandHandler
  extends DomainHandler
  implements ICommandHandler<UpdateVisualizationCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
