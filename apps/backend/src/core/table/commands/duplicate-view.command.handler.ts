import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { DuplicateViewCommandHandler as DomainHandler, DuplicateViewCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(DuplicateViewCommand)
export class DuplicateViewCommandHandler extends DomainHandler implements ICommandHandler<DuplicateViewCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}
