import { Table } from '@egodb/core'
import { EntityManager, UnderlyingTableSqliteManager } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableSqliteManager extends UnderlyingTableSqliteManager {
  constructor(protected readonly orm: MikroORM, protected readonly em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  create(table: Table): Promise<void> {
    return super.create(table)
  }
}
