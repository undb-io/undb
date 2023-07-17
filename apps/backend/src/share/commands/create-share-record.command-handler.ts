import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import {
  CreateShareRecordCommand,
  CreateShareRecordCommandHandler as DomainHandler,
  ICreateShareRecordOutput,
} from '@undb/cqrs'
import { InjectRecordRepository } from '../../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@CommandHandler(CreateShareRecordCommand)
export class NestCreateShareRecordCommandHandler
  extends DomainHandler
  implements ICommandHandler<CreateShareRecordCommand, ICreateShareRecordOutput>
{
  constructor(
    protected readonly guard: NestShareGuardService,
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(guard, tableRepo, recordRepo)
  }
}
