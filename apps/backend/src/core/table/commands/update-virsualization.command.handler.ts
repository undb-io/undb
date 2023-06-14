import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateVirsualizationCommandHandler as DomainHandler, UpdateVirsualizationCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(UpdateVirsualizationCommand)
export class UpdateVirsualizationCommandHandler
  extends DomainHandler
  implements ICommandHandler<UpdateVirsualizationCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
