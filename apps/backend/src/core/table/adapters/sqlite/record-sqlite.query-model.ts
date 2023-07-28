import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type {
  IQueryRecordSchema,
  IQueryRecords,
  IRecordQueryModel,
  IRecordSpec,
  RecordsWithCount,
  ViewId,
} from '@undb/core'
import { type IRepositoryOption } from '@undb/domain'
import { EntityManager, RecordSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const RECORD_QUERY_MODEL = Symbol('RECORD_QUERY_MODEL')
export const InjectRecordQueryModel = () => Inject(RECORD_QUERY_MODEL)

@Injectable()
export class NestRecordSqliteQueryModel extends RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    public readonly em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<IQueryRecords> {
    return super.find(tableId, viewId, spec, option)
  }

  @UseRequestContext()
  async findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<RecordsWithCount> {
    return super.findAndCount(tableId, viewId, spec, option)
  }

  @UseRequestContext()
  async findOne(tableId: string, spec: IRecordSpec | null): Promise<Option<IQueryRecordSchema>> {
    return super.findOne(tableId, spec)
  }

  @UseRequestContext()
  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>> {
    return super.findOneById(tableId, id)
  }

  @UseRequestContext()
  findDeletedAndCount(tableId: string, spec: IRecordSpec | null, option?: IRepositoryOption) {
    return super.findDeletedAndCount(tableId, spec, option)
  }
}
