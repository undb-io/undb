import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { ClsStore, IClsService } from '@undb/core'
import { Record, Table, type IRecordSpec } from '@undb/core'
import { type IUnitOfWork } from '@undb/domain'
import type { EntityManager } from '@undb/sqlite'
import { RecordSqliteRepository } from '@undb/sqlite'
import { ClsService } from 'nestjs-cls'
import type { Option } from 'oxide.ts'
import { NestOutboxService } from '../../../../outbox/outbox.service.js'
import { InjectUnitOfWork } from '../../../../uow/uow.service.js'

export const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY')
export const InjectRecordRepository = () => Inject(RECORD_REPOSITORY)

@Injectable()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestRecordSqliteRepository extends RecordSqliteRepository {
  constructor(
    @InjectUnitOfWork()
    protected readonly uow: IUnitOfWork<EntityManager>,
    protected readonly orm: MikroORM,
    protected readonly cls: ClsService<ClsStore>,
    protected readonly outboxService: NestOutboxService,
  ) {
    super(uow, cls as IClsService<ClsStore>, outboxService)
  }

  @CreateRequestContext()
  async insert(table: Table, record: Record): Promise<void> {
    return super.insert(table, record)
  }

  @CreateRequestContext()
  async insertMany(table: Table, records: Record[]): Promise<void> {
    return super.insertMany(table, records)
  }

  @CreateRequestContext()
  async findOneById(table: Table, id: string): Promise<Option<Record>> {
    return super.findOneById(table, id)
  }

  @CreateRequestContext()
  findDeletedOneById(table: Table, id: string): Promise<Option<Record>> {
    return super.findDeletedOneById(table, id)
  }

  @CreateRequestContext()
  async find(table: Table, spec: IRecordSpec): Promise<Record[]> {
    return super.find(table, spec)
  }

  @CreateRequestContext()
  async updateOneById(table: Table, id: string, spec: IRecordSpec): Promise<void> {
    return super.updateOneById(table, id, spec)
  }

  @CreateRequestContext()
  async deleteOneById(table: Table, id: string): Promise<void> {
    return super.deleteOneById(table, id)
  }

  @CreateRequestContext()
  async deleteManyByIds(table: Table, ids: string[]): Promise<void> {
    return super.deleteManyByIds(table, ids)
  }

  @CreateRequestContext()
  restoreOneById(table: Table, id: string): Promise<void> {
    return super.restoreOneById(table, id)
  }
}
