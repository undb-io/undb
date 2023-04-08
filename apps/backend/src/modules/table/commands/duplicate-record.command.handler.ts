import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { DuplicateRecordCommandHandler as DomainHandler, DuplicateRecordCommand } from '@undb/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(DuplicateRecordCommand)
export class DuplicateRecordCommandHandler extends DomainHandler implements ICommandHandler<DuplicateRecordCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
