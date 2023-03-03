import { Table, type ITableSpec } from '@egodb/core'
import type { EntityManager } from '@egodb/sqlite'
import { TableSqliteRepository, type IUnderlyingTableManager } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { Option } from 'oxide.ts'
import { InjectUndelyingTableManager } from './table-sqlite.manager.js'
InjectUndelyingTableManager
@Injectable()
export class NestTableSqliteRepository extends TableSqliteRepository {
  constructor(
    public readonly orm: MikroORM,
    @InjectUndelyingTableManager()
    protected readonly tm: IUnderlyingTableManager,
  ) {
    super(orm.em as EntityManager, tm)
  }

  @UseRequestContext()
  async findOneById(id: string): Promise<Option<Table>> {
    return super.findOneById(id)
  }

  @UseRequestContext()
  async findOne(spec: ITableSpec): Promise<Option<Table>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  async insert(table: Table): Promise<void> {
    return super.insert(table)
  }

  @UseRequestContext()
  async updateOneById(id: string, spec: ITableSpec): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @UseRequestContext()
  async deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
