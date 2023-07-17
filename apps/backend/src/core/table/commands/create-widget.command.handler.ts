import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { CreateWidgetCommand, CreateWidgetCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(CreateWidgetCommand)
export class CreateWidgetCommandHandler extends DomainHandler implements ICommandHandler<CreateWidgetCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
