import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { UpdateRecordCommandHandler as DomainHandler, UpdateRecordCommand } from '@undb/cqrs'
import { NestFLSAuthzService } from '../../../authz/fls/fls-authz.service.js'
import { NestRLSAuthzService } from '../../../authz/rls/rls-authz.service.js'
import { InjectRecordRepository } from '../adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(UpdateRecordCommand)
export class UpdateRecordCommandHandler extends DomainHandler implements ICommandHandler<UpdateRecordCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: NestRLSAuthzService,
    protected readonly fls: NestFLSAuthzService,
  ) {
    super(tableRepo, recordRepo, rls, fls)
  }
}
