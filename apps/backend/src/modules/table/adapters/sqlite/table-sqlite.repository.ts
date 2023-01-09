import { ITableSpec, Table } from '@egodb/core'
import { TableSqliteRepository } from '@egodb/sqlite'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { Option } from 'oxide.ts'

@Injectable()
export class NestTableSqliteRepository extends TableSqliteRepository {
  constructor(public readonly orm: MikroORM, protected readonly em: EntityManager) {
    super(em)
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
}
