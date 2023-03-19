import type {
  IQueryRecordSchema,
  IQueryRecords,
  IRecordQueryModel,
  IRecordSpec,
  ReferenceFieldTypes,
  ViewId,
} from '@egodb/core'
import type { EntityManager } from '@egodb/sqlite'
import { RecordSqliteQueryModel } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Option } from 'oxide.ts'

@Injectable()
export class NestRecordSqliteQueryModel extends RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  find(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes | undefined,
  ): Promise<IQueryRecords> {
    return super.find(tableId, viewId, spec, referenceField)
  }

  @UseRequestContext()
  async findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<{ records: IQueryRecords; total: number }> {
    return super.findAndCount(tableId, viewId, spec, referenceField)
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
