import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { DeleteWidgeCommand, DeleteWidgeCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(DeleteWidgeCommand)
export class DeleteWidgeCommandHandler extends DomainHandler implements ICommandHandler<DeleteWidgeCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
