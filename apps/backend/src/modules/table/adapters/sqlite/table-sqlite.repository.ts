import { Table } from '@egodb/core'
import { TableSqliteRepository } from '@egodb/sqlite'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableSqliteRepository extends TableSqliteRepository {
  constructor(public readonly orm: MikroORM, protected readonly em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  async insert(table: Table): Promise<void> {
    return super.insert(table)
  }
}
