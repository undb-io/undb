import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IQueryTable, ITableCache } from '@undb/core'
import { type ITableSpec } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { TableSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'
import { InjectTableKVCache } from './table-sqlite.repository.js'

@Injectable()
export class NestTableSqliteQueryModel extends TableSqliteQueryModel {
  constructor(public readonly orm: MikroORM, @InjectTableKVCache() protected readonly cache: ITableCache) {
    super(orm.em as EntityManager, cache)
  }

  @UseRequestContext()
  async find(): Promise<IQueryTable[]> {
    return super.find()
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
