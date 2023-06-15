import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { TableSpecHandler, type ITableRepository } from '@undb/core'
import { CreateFieldCommand, CreateFieldCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(CreateFieldCommand)
export class CreateFieldCommandHandler extends DomainHandler implements ICommandHandler<CreateFieldCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    protected readonly handler: TableSpecHandler,
  ) {
    super(tableRepo, handler)
  }
}
