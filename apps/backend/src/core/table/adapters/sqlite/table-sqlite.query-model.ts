import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryTable, TableCompositeSpecification } from '@undb/core'
import { type ITableCache, type ITableSpec } from '@undb/core'
import { EntityManager, TableSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'
import { InjectTableKVCache } from './table-sqlite.repository.js'

export const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectTableQueryModel = () => Inject(TABLE_QUERY_MODEL)

@Injectable()
export class NestTableSqliteQueryModel extends TableSqliteQueryModel {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
    @InjectTableKVCache() protected readonly cache: ITableCache,
  ) {
    super(em, cache)
  }

  @UseRequestContext()
  async find(spec: Option<TableCompositeSpecification>): Promise<IQueryTable[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  async findOneById(id: string): Promise<Option<IQueryTable>> {
    return super.findOneById(id)
  }
}
