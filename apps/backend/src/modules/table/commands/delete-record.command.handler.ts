import {
  DeleteRecordCommand,
  DeleteRecordCommandHandler as DomainHandler,
  IRecordRepository,
  ITableRepository,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters'

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
