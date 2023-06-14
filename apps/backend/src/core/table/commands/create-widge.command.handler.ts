import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { CreateWidgeCommand, CreateWidgeCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(CreateWidgeCommand)
export class CreateWidgeCommandHandler extends DomainHandler implements ICommandHandler<CreateWidgeCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
