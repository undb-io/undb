import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { DeleteRecordCommand, DeleteRecordCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(DeleteRecordCommand)
export class DeleteRecordCommandHandler extends DomainHandler implements ICommandHandler<DeleteRecordCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
