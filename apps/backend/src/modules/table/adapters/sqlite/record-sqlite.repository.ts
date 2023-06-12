import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { ClsStore, IRecordSpec, Record, Table, TableSchemaIdMap } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { RecordSqliteRepository } from '@undb/sqlite'
import { ClsService } from 'nestjs-cls'
import { Option } from 'oxide.ts'

@Injectable()
export class NestRecordSqliteRepository extends RecordSqliteRepository {
  constructor(protected readonly orm: MikroORM, protected readonly cls: ClsService<ClsStore>) {
    super(orm.em as EntityManager, cls)
  }

  @UseRequestContext()
  async insert(table: Table, record: Record, schema: TableSchemaIdMap): Promise<void> {
    return super.insert(table, record, schema)
  }

  @UseRequestContext()
  async insertMany(table: Table, records: Record[], schema: TableSchemaIdMap): Promise<void> {
    return super.insertMany(table, records, schema)
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
