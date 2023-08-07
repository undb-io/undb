import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICreateShareRecordOutput } from '@undb/cqrs'
import { CreateShareRecordCommand, CreateShareRecordCommandHandler as DomainHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { NestRLSAuthzService } from '../../authz/rls/rls-authz.service.js'
import { InjectRecordRepository } from '../../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@CommandHandler(CreateShareRecordCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
    protected readonly rls: NestRLSAuthzService,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(guard, tableRepo, recordRepo, rls, cls as IClsService<ClsStore>)
  }
}
