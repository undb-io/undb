import { type IRecordRepository, type ITableRepository } from '@egodb/core'
import { UpdateRecordCommand, UpdateRecordCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/index.js'

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
