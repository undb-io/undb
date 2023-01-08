import {
  IRecordRepository,
  ITableRepository,
  UpdateRecordCommand,
  UpdateRecordCommandHandler as DomainHandler,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/in-memory'

@CommandHandler(UpdateRecordCommand)
export class UpdateRecordCommandHandler extends DomainHandler implements ICommandHandler<UpdateRecordCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
