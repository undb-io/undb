import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { UpdateRecordCommandHandler as DomainHandler, UpdateRecordCommand } from '@undb/cqrs'
import { InjectRecordRepository, InjectTableRepository } from '../adapters/index.js'

@CommandHandler(UpdateRecordCommand)
export class UpdateRecordCommandHandler extends DomainHandler implements ICommandHandler<UpdateRecordCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
