import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IQueryRecordSchema, IQueryRecords, IRecordQueryModel, IRecordSpec, ViewId } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { RecordSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'

@Injectable()
export class NestRecordSqliteQueryModel extends RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
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
  async findOne(tableId: string, spec: IRecordSpec): Promise<Option<IQueryRecordSchema>> {
    return super.findOne(tableId, spec)
  }

  @UseRequestContext()
  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>> {
    return super.findOneById(tableId, id)
  }
}
