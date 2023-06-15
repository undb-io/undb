import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { DeleteRecordCommand, DeleteRecordCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordRepository, InjectTableRepository } from '../adapters/index.js'

@CommandHandler(DeleteRecordCommand)
export class DeleteRecordCommandHandler extends DomainHandler implements ICommandHandler<DeleteRecordCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
