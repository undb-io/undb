import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryRecordSchema, IQueryRecords, IRecordQueryModel, IRecordSpec, ViewId } from '@undb/core'
import { EntityManager, RecordSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const RECORD_QUERY_MODEL = Symbol('RECORD_QUERY_MODEL')
export const InjectRecordQueryModel = () => Inject(RECORD_QUERY_MODEL)

@Injectable()
export class NestRecordSqliteQueryModel extends RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly orm: MikroORM, public readonly em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  find(tableId: string, viewId: ViewId | undefined, spec: IRecordSpec | null): Promise<IQueryRecords> {
    return super.find(tableId, viewId, spec)
  }

  @UseRequestContext()
  async findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
  ): Promise<{ records: IQueryRecords; total: number }> {
    return super.findAndCount(tableId, viewId, spec)
  }

  @UseRequestContext()
  async findOne(tableId: string, spec: IRecordSpec | null): Promise<Option<IQueryRecordSchema>> {
    return super.findOne(tableId, spec)
  }

  @UseRequestContext()
  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>> {
    return super.findOneById(tableId, id)
  }
}
