import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IRecordSpec, Record, TableSchemaIdMap } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { RecordSqliteRepository } from '@undb/sqlite'
import { Option } from 'oxide.ts'

@Injectable()
export class NestRecordSqliteRepository extends RecordSqliteRepository {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  async insert(record: Record, schema: TableSchemaIdMap): Promise<void> {
    return super.insert(record, schema)
  }

  @UseRequestContext()
  async insertMany(records: Record[], schema: TableSchemaIdMap): Promise<void> {
    return super.insertMany(records, schema)
  }

  @UseRequestContext()
  async findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<Record>> {
    return super.findOneById(tableId, id, schema)
  }

  @UseRequestContext()
  async find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Record[]> {
    return super.find(tableId, spec, schema)
  }

  @UseRequestContext()
  async updateOneById(tableId: string, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void> {
    return super.updateOneById(tableId, id, schema, spec)
  }

  @UseRequestContext()
  async deleteOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<void> {
    return super.deleteOneById(tableId, id, schema)
  }

  @UseRequestContext()
  async deleteManyByIds(tableId: string, ids: string[], schema: TableSchemaIdMap): Promise<void> {
    return super.deleteManyByIds(tableId, ids, schema)
  }
}
